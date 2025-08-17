module betcaps::treasury {
    use std::signer;
    use std::error;
    use aptos_framework::coin::{Self, Coin};

    // Error codes
    const ENOT_AUTHORIZED: u64 = 1;
    const EINVALID_AMOUNT: u64 = 2;

    // Treasury capability
    struct TreasuryCapability has key {
        admin: address,
    }

    // Initialize the treasury
    public entry fun initialize(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        
        // Create treasury capability
        move_to(admin, TreasuryCapability {
            admin: admin_addr,
        });
    }

    // Withdraw tokens from treasury
    public entry fun withdraw<CoinType>(
        admin: &signer,
        recipient: address,
        amount: u64,
    ) acquires TreasuryCapability {
        let admin_addr = signer::address_of(admin);
        
        // Verify admin
        let cap = borrow_global<TreasuryCapability>(@betcaps);
        assert!(admin_addr == cap.admin, error::permission_denied(ENOT_AUTHORIZED));
        assert!(amount > 0, error::invalid_argument(EINVALID_AMOUNT));
        
        // Withdraw coins
        let coins = coin::withdraw<CoinType>(admin, amount);
        
        // Deposit to recipient
        if (!coin::is_account_registered<CoinType>(recipient)) {
            coin::register<CoinType>(recipient);
        };
        coin::deposit(recipient, coins);
    }

    // Change admin
    public entry fun change_admin(
        current_admin: &signer,
        new_admin: address,
    ) acquires TreasuryCapability {
        let current_admin_addr = signer::address_of(current_admin);
        
        // Verify current admin
        let cap = borrow_global_mut<TreasuryCapability>(@betcaps);
        assert!(current_admin_addr == cap.admin, error::permission_denied(ENOT_AUTHORIZED));
        
        // Update admin
        cap.admin = new_admin;
    }
}
