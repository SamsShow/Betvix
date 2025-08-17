module betcaps::market_factory {
    use std::string::{String};
    use std::signer;
    use std::vector;
    use std::error;
    use aptos_framework::account;
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::timestamp;
    use betcaps::binary_market::{Self, BinaryMarket, MarketInfo};
    
    // Constants
    const MAX_FEE_BPS: u64 = 1000; // 10% max fee
    
    // Error codes
    const ENOT_AUTHORIZED: u64 = 1;
    const EINVALID_FEE: u64 = 2;
    const EINVALID_DEADLINE: u64 = 3;
    const EINVALID_LIQUIDITY: u64 = 4;
    const EINVALID_RESOLVER: u64 = 5;

    // Resources
    struct FactoryCapability has key {
        market_count: u64,
        admin: address,
        treasury: address,
        max_fee_bps: u64,
    }

    // Events
    struct MarketCreatedEvent has drop, store {
        market_address: address,
        market_id: u64,
        statement: String,
        criteria_uri: String,
        deadline: u64,
    }

    // Initialize the factory
    public entry fun initialize(
        admin: &signer,
        treasury: address,
        max_fee_bps: u64,
    ) {
        let admin_addr = signer::address_of(admin);
        
        // Validate parameters
        assert!(max_fee_bps <= MAX_FEE_BPS, error::invalid_argument(EINVALID_FEE));
        
        // Create capability
        move_to(admin, FactoryCapability {
            market_count: 0,
            admin: admin_addr,
            treasury,
            max_fee_bps,
        });
    }

    // Create a new market
    public entry fun create_market<CoinType>(
        creator: &signer,
        statement: String,
        resolver: address,
        fee_bps: u64,
        deadline: u64,
        criteria_uri: String,
        initial_yes_liquidity: u64,
        initial_no_liquidity: u64,
    ) acquires FactoryCapability {
        let creator_addr = signer::address_of(creator);
        
        // Get factory capability
        let factory_cap = borrow_global_mut<FactoryCapability>(@betcaps);
        
        // Validate parameters
        assert!(creator_addr == factory_cap.admin, error::permission_denied(ENOT_AUTHORIZED));
        assert!(fee_bps <= factory_cap.max_fee_bps, error::invalid_argument(EINVALID_FEE));
        assert!(deadline > timestamp::now_seconds(), error::invalid_argument(EINVALID_DEADLINE));
        assert!(initial_yes_liquidity > 0 && initial_no_liquidity > 0, error::invalid_argument(EINVALID_LIQUIDITY));
        assert!(resolver != @0x0, error::invalid_argument(EINVALID_RESOLVER));
        
        // Generate market ID
        let market_id = factory_cap.market_count;
        factory_cap.market_count = market_id + 1;
        
        // Create resource account for the market
        let (market_signer, market_cap) = account::create_resource_account(creator, vector::empty());
        let market_addr = signer::address_of(&market_signer);
        
        // Create market info
        let market_info = MarketInfo {
            statement,
            resolver,
            treasury: factory_cap.treasury,
            fee_bps,
            deadline,
            criteria_uri,
        };

        // Withdraw initial liquidity from creator
        let yes_coins = coin::withdraw<CoinType>(creator, initial_yes_liquidity);
        let no_coins = coin::withdraw<CoinType>(creator, initial_no_liquidity);
        
        // Initialize market
        binary_market::initialize<CoinType>(&market_signer, market_info, market_cap, yes_coins, no_coins);
        
        // Emit event
        event::emit(MarketCreatedEvent {
            market_address: market_addr,
            market_id,
            statement,
            criteria_uri,
            deadline,
        });
    }

    // Update treasury address
    public entry fun set_treasury(
        admin: &signer,
        new_treasury: address,
    ) acquires FactoryCapability {
        let admin_addr = signer::address_of(admin);
        
        // Get factory capability and verify admin
        let factory_cap = borrow_global_mut<FactoryCapability>(@betcaps);
        assert!(admin_addr == factory_cap.admin, error::permission_denied(ENOT_AUTHORIZED));
        
        // Update treasury
        factory_cap.treasury = new_treasury;
    }

    // Update max fee
    public entry fun set_max_fee(
        admin: &signer,
        new_max_fee_bps: u64,
    ) acquires FactoryCapability {
        let admin_addr = signer::address_of(admin);
        
        // Get factory capability and verify admin
        let factory_cap = borrow_global_mut<FactoryCapability>(@betcaps);
        assert!(admin_addr == factory_cap.admin, error::permission_denied(ENOT_AUTHORIZED));
        
        // Validate and update max fee
        assert!(new_max_fee_bps <= MAX_FEE_BPS, error::invalid_argument(EINVALID_FEE));
        factory_cap.max_fee_bps = new_max_fee_bps;
    }
}
