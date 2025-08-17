module betcaps::binary_market {
    use std::string::{String};
    use std::signer;
    use std::error;
    use aptos_framework::account::{Self, SignerCapability};
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::timestamp;
    use aptos_framework::event::{Self, EventHandle};

    // Constants
    const PRECISION: u128 = 1000000000000000000; // 1e18

    // Market state
    const STATE_OPEN: u8 = 0;
    const STATE_AWAITING_RESOLUTION: u8 = 1;
    const STATE_RESOLVED_YES: u8 = 2;
    const STATE_RESOLVED_NO: u8 = 3;
    const STATE_INVALID: u8 = 4;
    const STATE_PAUSED: u8 = 5;

    // Error codes
    const ENOT_AUTHORIZED: u64 = 1;
    const EMARKET_NOT_OPEN: u64 = 2;
    const EINVALID_AMOUNT: u64 = 3;
    const EDEADLINE_NOT_REACHED: u64 = 4;
    const EINVALID_STATE: u64 = 5;
    const EMARKET_NOT_RESOLVED: u64 = 6;
    const ENO_WINNING_BET: u64 = 7;
    const ENO_BETS_TO_REFUND: u64 = 8;
    const EMARKET_NOT_INVALID: u64 = 9;

    // Events
    struct PredictedEvent has drop, store {
        user: address,
        is_yes: bool,
        amount: u64,
    }

    struct ClosedEvent has drop, store {
        timestamp: u64,
    }

    struct ResolvedEvent has drop, store {
        outcome: bool,
        is_valid: bool,
    }

    struct ClaimedEvent has drop, store {
        user: address,
        amount: u64,
    }

    struct RefundedEvent has drop, store {
        user: address,
        amount: u64,
    }

    // Market info structure
    struct MarketInfo has store, drop {
        statement: String,
        resolver: address,
        treasury: address,
        fee_bps: u64,
        deadline: u64,
        criteria_uri: String,
    }

    // User bet record
    struct Bet has store {
        yes_amount: u64,
        no_amount: u64,
    }

    // Binary market resource
    struct BinaryMarket has key {
        statement: String,
        resolver: address,
        treasury: address,
        fee_bps: u64,
        deadline: u64,
        criteria_uri: String,
        state: u8,
        yes_pool: u64,
        no_pool: u64,
        signer_cap: SignerCapability,
        predicted_events: EventHandle<PredictedEvent>,
        closed_events: EventHandle<ClosedEvent>,
        resolved_events: EventHandle<ResolvedEvent>,
        claimed_events: EventHandle<ClaimedEvent>,
        refunded_events: EventHandle<RefundedEvent>,
    }

    // User bets mapping
    struct UserBets has key {
        bets: Bet,
    }

    // Initialize a new binary market
    public fun initialize<CoinType>(
        market_acct: &signer,
        market_info: MarketInfo,
        signer_cap: SignerCapability,
        yes_coins: Coin<CoinType>,
        no_coins: Coin<CoinType>,
    ) {
        // Initialize coin store if needed
        if (!coin::is_account_registered<CoinType>(signer::address_of(market_acct))) {
            coin::register<CoinType>(market_acct);
        };
        
        // Deposit initial liquidity
        coin::deposit(signer::address_of(market_acct), yes_coins);
        coin::deposit(signer::address_of(market_acct), no_coins);
        
        // Create binary market resource
        move_to(market_acct, BinaryMarket {
            statement: market_info.statement,
            resolver: market_info.resolver,
            treasury: market_info.treasury,
            fee_bps: market_info.fee_bps,
            deadline: market_info.deadline,
            criteria_uri: market_info.criteria_uri,
            state: STATE_OPEN,
            yes_pool: coin::value(&yes_coins),
            no_pool: coin::value(&no_coins),
            signer_cap,
            predicted_events: account::new_event_handle<PredictedEvent>(market_acct),
            closed_events: account::new_event_handle<ClosedEvent>(market_acct),
            resolved_events: account::new_event_handle<ResolvedEvent>(market_acct),
            claimed_events: account::new_event_handle<ClaimedEvent>(market_acct),
            refunded_events: account::new_event_handle<RefundedEvent>(market_acct),
        });
    }

    // Place a YES bet
    public entry fun predict_yes<CoinType>(
        user: &signer,
        market_addr: address,
        amount: u64,
    ) acquires BinaryMarket, UserBets {
        // Get market state and validate
        let market = borrow_global_mut<BinaryMarket>(market_addr);
        assert!(market.state == STATE_OPEN, error::invalid_state(EMARKET_NOT_OPEN));
        assert!(timestamp::now_seconds() < market.deadline, error::invalid_state(EMARKET_NOT_OPEN));
        assert!(amount > 0, error::invalid_argument(EINVALID_AMOUNT));
        
        // Withdraw coins from user
        let user_addr = signer::address_of(user);
        let coins = coin::withdraw<CoinType>(user, amount);
        
        // Deposit to market account
        let market_signer = account::create_signer_with_capability(&market.signer_cap);
        coin::deposit(signer::address_of(&market_signer), coins);
        
        // Update yes pool
        market.yes_pool = market.yes_pool + amount;
        
        // Update user bets
        if (!exists<UserBets>(user_addr)) {
            move_to(user, UserBets { bets: Bet { yes_amount: 0, no_amount: 0 } });
        };
        let user_bets = borrow_global_mut<UserBets>(user_addr);
        user_bets.bets.yes_amount = user_bets.bets.yes_amount + amount;
        
        // Emit event
        event::emit_event(&mut market.predicted_events, PredictedEvent {
            user: user_addr,
            is_yes: true,
            amount,
        });
    }

    // Place a NO bet
    public entry fun predict_no<CoinType>(
        user: &signer,
        market_addr: address,
        amount: u64,
    ) acquires BinaryMarket, UserBets {
        // Get market state and validate
        let market = borrow_global_mut<BinaryMarket>(market_addr);
        assert!(market.state == STATE_OPEN, error::invalid_state(EMARKET_NOT_OPEN));
        assert!(timestamp::now_seconds() < market.deadline, error::invalid_state(EMARKET_NOT_OPEN));
        assert!(amount > 0, error::invalid_argument(EINVALID_AMOUNT));
        
        // Withdraw coins from user
        let user_addr = signer::address_of(user);
        let coins = coin::withdraw<CoinType>(user, amount);
        
        // Deposit to market account
        let market_signer = account::create_signer_with_capability(&market.signer_cap);
        coin::deposit(signer::address_of(&market_signer), coins);
        
        // Update no pool
        market.no_pool = market.no_pool + amount;
        
        // Update user bets
        if (!exists<UserBets>(user_addr)) {
            move_to(user, UserBets { bets: Bet { yes_amount: 0, no_amount: 0 } });
        };
        let user_bets = borrow_global_mut<UserBets>(user_addr);
        user_bets.bets.no_amount = user_bets.bets.no_amount + amount;
        
        // Emit event
        event::emit_event(&mut market.predicted_events, PredictedEvent {
            user: user_addr,
            is_yes: false,
            amount,
        });
    }

    // Close the market after deadline
    public entry fun close(
        caller: &signer,
        market_addr: address,
    ) acquires BinaryMarket {
        // Get market state
        let market = borrow_global_mut<BinaryMarket>(market_addr);
        
        // Validate deadline and state
        assert!(timestamp::now_seconds() >= market.deadline, error::invalid_state(EDEADLINE_NOT_REACHED));
        assert!(market.state == STATE_OPEN, error::invalid_state(EINVALID_STATE));
        
        // Update market state
        market.state = STATE_AWAITING_RESOLUTION;
        
        // Emit event
        event::emit_event(&mut market.closed_events, ClosedEvent {
            timestamp: timestamp::now_seconds(),
        });
    }

    // Resolve the market
    public entry fun resolve(
        resolver: &signer,
        market_addr: address,
        outcome: bool,
        is_valid: bool,
    ) acquires BinaryMarket {
        let resolver_addr = signer::address_of(resolver);
        
        // Get market and validate resolver
        let market = borrow_global_mut<BinaryMarket>(market_addr);
        assert!(resolver_addr == market.resolver, error::permission_denied(ENOT_AUTHORIZED));
        assert!(market.state == STATE_AWAITING_RESOLUTION, error::invalid_state(EINVALID_STATE));
        
        // Update market state based on resolution
        if (!is_valid) {
            market.state = STATE_INVALID;
        } else if (outcome) {
            market.state = STATE_RESOLVED_YES;
        } else {
            market.state = STATE_RESOLVED_NO;
        };
        
        // Emit event
        event::emit_event(&mut market.resolved_events, ResolvedEvent {
            outcome,
            is_valid,
        });
    }

    // Claim winnings after market resolution
    public entry fun claim<CoinType>(
        user: &signer,
        market_addr: address,
    ) acquires BinaryMarket, UserBets {
        let user_addr = signer::address_of(user);
        
        // Get market and validate state
        let market = borrow_global_mut<BinaryMarket>(market_addr);
        assert!(
            market.state == STATE_RESOLVED_YES || market.state == STATE_RESOLVED_NO,
            error::invalid_state(EMARKET_NOT_RESOLVED)
        );
        
        // Get user bets
        assert!(exists<UserBets>(user_addr), error::not_found(ENO_WINNING_BET));
        let user_bets = borrow_global_mut<UserBets>(user_addr);
        
        // Check if user has winning bets
        let winning_outcome = (market.state == STATE_RESOLVED_YES);
        let user_bet = if (winning_outcome) {
            user_bets.bets.yes_amount
        } else {
            user_bets.bets.no_amount
        };
        
        assert!(user_bet > 0, error::invalid_state(ENO_WINNING_BET));
        
        // Calculate winnings
        let total_pool = market.yes_pool + market.no_pool;
        let winning_pool = if (winning_outcome) market.yes_pool else market.no_pool;
        let user_share = ((user_bet as u128) * PRECISION) / (winning_pool as u128);
        let gross_payout = ((total_pool as u128) * user_share) / PRECISION;
        
        // Apply fee
        let fee = ((gross_payout * (market.fee_bps as u128)) / 10000);
        let net_payout = ((gross_payout - fee) as u64);
        let fee_amount = ((fee as u64));
        
        // Reset user's bet to prevent double claiming
        if (winning_outcome) {
            user_bets.bets.yes_amount = 0;
        } else {
            user_bets.bets.no_amount = 0;
        };
        
        // Withdraw and transfer coins
        let market_signer = account::create_signer_with_capability(&market.signer_cap);
        
        // Transfer winnings to user
        let payout_coins = coin::withdraw<CoinType>(&market_signer, net_payout);
        coin::deposit(user_addr, payout_coins);
        
        // Transfer fee to treasury
        if (fee_amount > 0) {
            let fee_coins = coin::withdraw<CoinType>(&market_signer, fee_amount);
            coin::deposit(market.treasury, fee_coins);
        };
        
        // Emit event
        event::emit_event(&mut market.claimed_events, ClaimedEvent {
            user: user_addr,
            amount: net_payout,
        });
    }

    // Refund bets for invalid markets
    public entry fun refund<CoinType>(
        user: &signer,
        market_addr: address,
    ) acquires BinaryMarket, UserBets {
        let user_addr = signer::address_of(user);
        
        // Get market and validate state
        let market = borrow_global_mut<BinaryMarket>(market_addr);
        assert!(market.state == STATE_INVALID, error::invalid_state(EMARKET_NOT_INVALID));
        
        // Get user bets
        assert!(exists<UserBets>(user_addr), error::not_found(ENO_BETS_TO_REFUND));
        let user_bets = borrow_global_mut<UserBets>(user_addr);
        
        // Calculate total refund
        let yes_amount = user_bets.bets.yes_amount;
        let no_amount = user_bets.bets.no_amount;
        let total_refund = yes_amount + no_amount;
        
        assert!(total_refund > 0, error::invalid_state(ENO_BETS_TO_REFUND));
        
        // Reset user's bets
        user_bets.bets.yes_amount = 0;
        user_bets.bets.no_amount = 0;
        
        // Withdraw and transfer refund
        let market_signer = account::create_signer_with_capability(&market.signer_cap);
        let refund_coins = coin::withdraw<CoinType>(&market_signer, total_refund);
        coin::deposit(user_addr, refund_coins);
        
        // Emit event
        event::emit_event(&mut market.refunded_events, RefundedEvent {
            user: user_addr,
            amount: total_refund,
        });
    }

    // Get current odds
    public fun get_odds(market_addr: address): (u128, u128) acquires BinaryMarket {
        let market = borrow_global<BinaryMarket>(market_addr);
        let total_pool = (market.yes_pool as u128) + (market.no_pool as u128);
        
        if (total_pool == 0) {
            return (PRECISION / 2, PRECISION / 2) // 50/50 if no liquidity
        };
        
        let yes_odds = ((market.no_pool as u128) * PRECISION) / total_pool;
        let no_odds = ((market.yes_pool as u128) * PRECISION) / total_pool;
        
        (yes_odds, no_odds)
    }

    // Pause the market
    public entry fun pause(
        resolver: &signer,
        market_addr: address,
    ) acquires BinaryMarket {
        let resolver_addr = signer::address_of(resolver);
        
        // Get market and validate resolver
        let market = borrow_global_mut<BinaryMarket>(market_addr);
        assert!(resolver_addr == market.resolver, error::permission_denied(ENOT_AUTHORIZED));
        
        if (market.state == STATE_OPEN) {
            market.state = STATE_PAUSED;
        };
    }

    // Unpause the market
    public entry fun unpause(
        resolver: &signer,
        market_addr: address,
    ) acquires BinaryMarket {
        let resolver_addr = signer::address_of(resolver);
        
        // Get market and validate resolver
        let market = borrow_global_mut<BinaryMarket>(market_addr);
        assert!(resolver_addr == market.resolver, error::permission_denied(ENOT_AUTHORIZED));
        
        if (market.state == STATE_PAUSED) {
            market.state = STATE_OPEN;
        };
    }
}
