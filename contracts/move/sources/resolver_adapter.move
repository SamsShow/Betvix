module betcaps::resolver_adapter {
    use std::signer;
    use std::error;
    use aptos_framework::event::{Self, EventHandle};
    use betcaps::binary_market;

    // Error codes
    const ENOT_AUTHORIZED: u64 = 1;
    const EALREADY_RESOLVED: u64 = 2;
    const EINVALID_MARKET: u64 = 3;

    // Resolver capability
    struct ResolverCapability has key {
        admin: address,
        resolvers: vector<address>,
    }

    // Market resolution tracking
    struct ResolutionRegistry has key {
        resolved_markets: vector<address>,
        resolution_events: EventHandle<MarketResolvedEvent>,
    }

    // Events
    struct MarketResolvedEvent has drop, store {
        market: address,
        outcome: bool,
        is_valid: bool,
    }

    // Initialize the resolver adapter
    public entry fun initialize(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        
        // Create resolver capability
        move_to(admin, ResolverCapability {
            admin: admin_addr,
            resolvers: vector::singleton(admin_addr),
        });
        
        // Create resolution registry
        move_to(admin, ResolutionRegistry {
            resolved_markets: vector::empty(),
            resolution_events: account::new_event_handle<MarketResolvedEvent>(admin),
        });
    }

    // Add a resolver
    public entry fun add_resolver(
        admin: &signer,
        resolver: address,
    ) acquires ResolverCapability {
        let admin_addr = signer::address_of(admin);
        
        // Get capability and verify admin
        let cap = borrow_global_mut<ResolverCapability>(@betcaps);
        assert!(admin_addr == cap.admin, error::permission_denied(ENOT_AUTHORIZED));
        
        // Add resolver if not already in the list
        if (!vector::contains(&cap.resolvers, &resolver)) {
            vector::push_back(&mut cap.resolvers, resolver);
        };
    }

    // Remove a resolver
    public entry fun remove_resolver(
        admin: &signer,
        resolver: address,
    ) acquires ResolverCapability {
        let admin_addr = signer::address_of(admin);
        
        // Get capability and verify admin
        let cap = borrow_global_mut<ResolverCapability>(@betcaps);
        assert!(admin_addr == cap.admin, error::permission_denied(ENOT_AUTHORIZED));
        
        // Find and remove the resolver
        let (found, index) = vector::index_of(&cap.resolvers, &resolver);
        if (found) {
            vector::remove(&mut cap.resolvers, index);
        };
    }

    // Resolve a market with manual input
    public entry fun resolve_market(
        resolver: &signer,
        market: address,
        outcome: bool,
        is_valid: bool,
    ) acquires ResolverCapability, ResolutionRegistry {
        let resolver_addr = signer::address_of(resolver);
        
        // Verify resolver is authorized
        let cap = borrow_global<ResolverCapability>(@betcaps);
        assert!(vector::contains(&cap.resolvers, &resolver_addr), error::permission_denied(ENOT_AUTHORIZED));
        
        // Get registry and check if market is already resolved
        let registry = borrow_global_mut<ResolutionRegistry>(@betcaps);
        assert!(!vector::contains(&registry.resolved_markets, &market), error::already_exists(EALREADY_RESOLVED));
        
        // Mark as resolved
        vector::push_back(&mut registry.resolved_markets, market);
        
        // Call the market's resolve function
        binary_market::resolve(resolver, market, outcome, is_valid);
        
        // Emit event
        event::emit_event(&mut registry.resolution_events, MarketResolvedEvent {
            market,
            outcome,
            is_valid,
        });
    }

    // Check if a market has been resolved
    public fun is_resolved(market: address): bool acquires ResolutionRegistry {
        let registry = borrow_global<ResolutionRegistry>(@betcaps);
        vector::contains(&registry.resolved_markets, &market)
    }
}
