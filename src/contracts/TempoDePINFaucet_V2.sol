// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TempoDePINFaucet V2
 * @dev Fixed version - allows multiple claims per user
 * @notice This contract holds and distributes Sepolia ETH as DePIN rewards
 * 
 * Key Fixes from V1:
 * - Removed hasClaimed mapping that blocked multiple claims
 * - Users can now receive multiple reward allocations
 * - Each setClaimableReward() overwrites previous unclaimed amount
 * - Maintains all safety mechanisms
 * 
 * Deploy on: Ethereum Sepolia Testnet
 * Chain ID: 11155111
 * 
 * DEPLOYMENT INSTRUCTIONS:
 * 1. Open Remix IDE (remix.ethereum.org)
 * 2. Create new file: TempoDePINFaucet_V2.sol
 * 3. Paste this code
 * 4. Compile with Solidity 0.8.20
 * 5. Connect MetaMask to Sepolia testnet
 * 6. Deploy from your deployer wallet (same one with TEMPO_DEPLOYER_PRIVATE_KEY)
 * 7. After deploy, send 0.2 ETH to the new contract address
 * 8. Verify contract on Etherscan
 * 9. Update TEMPO_DEPIN_FAUCET_ADDRESS in src/contracts/TempoDePINFaucet.ts
 */
contract TempoDePINFaucet {
    
    // ============= STATE VARIABLES =============
    
    address public owner;
    
    /// @notice Mapping of user addresses to their claimable reward amounts (in wei)
    /// @dev This can be overwritten for new claims - no hasClaimed blocking
    mapping(address => uint256) public claimableRewards;
    
    /// @notice Total rewards distributed by the contract
    uint256 public totalDistributed;
    
    /// @notice Contract creation timestamp
    uint256 public deployedAt;
    
    /// @notice Track claim IDs to prevent duplicate processing
    mapping(string => bool) public claimIdUsed;
    
    // ============= EVENTS =============
    
    event RewardsAllocated(
        address indexed user, 
        uint256 amount, 
        string claimId
    );
    
    event RewardsClaimed(
        address indexed user, 
        uint256 amount, 
        uint256 timestamp
    );
    
    event FundsDeposited(uint256 amount);
    
    event FundsWithdrawn(uint256 amount);
    
    // ============= MODIFIERS =============
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    // ============= CONSTRUCTOR =============
    
    constructor() {
        owner = msg.sender;
        deployedAt = block.timestamp;
    }
    
    // ============= EXTERNAL FUNCTIONS =============
    
    /**
     * @notice Sets claimable rewards for a user (FIXED - no hasClaimed check)
     * @dev Overwrites previous unclaimed amount - allows multiple claims
     * @param user The user's wallet address
     * @param amount The amount of Sepolia ETH to allocate (in wei)
     * @param claimId The batch claim ID for tracking
     */
    function setClaimableReward(
        address user, 
        uint256 amount, 
        string calldata claimId
    ) external onlyOwner {
        require(user != address(0), "Invalid user address");
        require(amount > 0, "Amount must be greater than 0");
        require(!claimIdUsed[claimId], "Claim ID already used");
        
        // Overwrite previous unclaimed amount (this is the fix!)
        claimableRewards[user] = amount;
        claimIdUsed[claimId] = true;
        
        emit RewardsAllocated(user, amount, claimId);
    }
    
    /**
     * @notice Allows users to claim their allocated Sepolia ETH rewards
     * @dev Resets claimableRewards to 0 after successful claim
     */
    function claimRewards() external {
        address user = msg.sender;
        uint256 amount = claimableRewards[user];
        
        require(amount > 0, "No rewards to claim");
        require(address(this).balance >= amount, "Insufficient contract balance");
        
        // Reset claimable amount BEFORE transfer (reentrancy protection)
        claimableRewards[user] = 0;
        totalDistributed += amount;
        
        // Transfer Sepolia ETH to user
        (bool success, ) = user.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit RewardsClaimed(user, amount, block.timestamp);
    }
    
    /**
     * @notice Batch set claimable rewards for multiple users
     * @param users Array of user wallet addresses
     * @param amounts Array of reward amounts (in wei)
     * @param claimIds Array of claim IDs for tracking
     */
    function batchSetClaimableRewards(
        address[] calldata users,
        uint256[] calldata amounts,
        string[] calldata claimIds
    ) external onlyOwner {
        require(
            users.length == amounts.length && amounts.length == claimIds.length,
            "Array lengths must match"
        );
        
        for (uint256 i = 0; i < users.length; i++) {
            require(users[i] != address(0), "Invalid user address");
            require(amounts[i] > 0, "Amount must be greater than 0");
            require(!claimIdUsed[claimIds[i]], "Claim ID already used");
            
            claimableRewards[users[i]] = amounts[i];
            claimIdUsed[claimIds[i]] = true;
            emit RewardsAllocated(users[i], amounts[i], claimIds[i]);
        }
    }
    
    /**
     * @notice Deposits ETH into the contract to fund rewards
     */
    function deposit() external payable {
        require(msg.value > 0, "Must send ETH");
        emit FundsDeposited(msg.value);
    }
    
    /**
     * @notice Allows owner to withdraw excess ETH from contract
     */
    function withdraw(uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient balance");
        
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Withdrawal failed");
        
        emit FundsWithdrawn(amount);
    }
    
    /**
     * @notice Emergency withdrawal - drains entire contract balance to owner
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = owner.call{value: balance}("");
        require(success, "Emergency withdrawal failed");
        
        emit FundsWithdrawn(balance);
    }
    
    /**
     * @notice Transfers ownership to a new address
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner");
        owner = newOwner;
    }
    
    // ============= VIEW FUNCTIONS =============
    
    /**
     * @notice Returns the contract's current ETH balance
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @notice Checks if a user has claimable rewards
     * @param user The user's wallet address
     * @return amount The claimable amount in wei
     * @return claimed Always returns false (removed hasClaimed)
     */
    function getClaimStatus(address user) external view returns (
        uint256 amount, 
        bool claimed
    ) {
        // claimed is always false - we just track amount now
        return (claimableRewards[user], false);
    }
    
    /**
     * @notice Returns contract statistics
     */
    function getContractStats() external view returns (
        uint256 balance,
        uint256 distributed,
        uint256 deployed
    ) {
        return (
            address(this).balance,
            totalDistributed,
            deployedAt
        );
    }
    
    // ============= RECEIVE FUNCTION =============
    
    receive() external payable {
        emit FundsDeposited(msg.value);
    }
}
