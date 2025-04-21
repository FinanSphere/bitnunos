const fetch = require('node-fetch');

async function testStakingAPI() {
  console.log('\n=== Testing Staking API Endpoints ===\n');
  
  try {
    // Test 1: Get all staking pools
    console.log('Test 1: Fetching staking pools...');
    const poolsResponse = await fetch('http://localhost:5000/api/staking/pools');
    
    if (!poolsResponse.ok) {
      throw new Error(`Failed to fetch staking pools: ${poolsResponse.status} ${poolsResponse.statusText}`);
    }
    
    const pools = await poolsResponse.json();
    console.log(`✅ Successfully fetched ${pools.length} staking pools`);
    
    if (pools.length > 0) {
      console.log(`Sample pool: ${JSON.stringify(pools[0], null, 2)}`);
    }
    
    // Test 2: Create a test staking pool
    console.log('\nTest 2: Creating a test staking pool...');
    const newPool = {
      name: "Test Staking Pool",
      description: "A test pool created via API",
      tokenAddress: "0x1234567890abcdef1234567890abcdef12345678",
      rewardTokenAddress: "0x1234567890abcdef1234567890abcdef12345678",
      networkId: "ethereum",
      poolType: "single",
      apr: "12.5",
      totalStaked: "0",
      minStakeAmount: "0.01",
      maxStakeAmount: "100",
      lockPeriodDays: 30,
      earlyWithdrawalFee: "10",
      stakingGuide: "Test your staking with this pool",
      isActive: true,
      autoCompoundEnabled: true,
      autoCompoundFrequency: "daily",
      boostEnabled: true,
      boostMultiplier: "1.5"
    };
    
    const createResponse = await fetch('http://localhost:5000/api/staking/pools', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPool)
    });
    
    if (!createResponse.ok) {
      throw new Error(`Failed to create staking pool: ${createResponse.status} ${createResponse.statusText}`);
    }
    
    const createdPool = await createResponse.json();
    console.log(`✅ Successfully created test staking pool with ID: ${createdPool.id}`);
    const testPoolId = createdPool.id;
    
    // Test 3: Get a specific staking pool by ID
    console.log(`\nTest 3: Fetching staking pool with ID ${testPoolId}...`);
    const poolResponse = await fetch(`http://localhost:5000/api/staking/pools/${testPoolId}`);
    
    if (!poolResponse.ok) {
      throw new Error(`Failed to fetch staking pool: ${poolResponse.status} ${poolResponse.statusText}`);
    }
    
    const pool = await poolResponse.json();
    console.log(`✅ Successfully fetched staking pool: ${pool.name}`);
    
    // Test 4: Update the staking pool
    console.log(`\nTest 4: Updating staking pool with ID ${testPoolId}...`);
    const updatedPool = {
      ...pool,
      description: "Updated test description",
      apr: "15.0",
    };
    
    const updateResponse = await fetch(`http://localhost:5000/api/staking/pools/${testPoolId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedPool)
    });
    
    if (!updateResponse.ok) {
      throw new Error(`Failed to update staking pool: ${updateResponse.status} ${updateResponse.statusText}`);
    }
    
    const updated = await updateResponse.json();
    console.log(`✅ Successfully updated staking pool - APR changed to: ${updated.apr}`);
    
    // Get a login token for user operations
    console.log('\nLogging in to test user-specific endpoints...');
    const loginResponse = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'testuser',
        password: 'password123'
      })
    });
    
    if (!loginResponse.ok) {
      console.log('⚠️ Login failed - skipping user-specific tests. Create a test user with username "testuser" and password "password123" to test these endpoints.');
    } else {
      const loginData = await loginResponse.json();
      const authToken = loginData.token;
      const userId = loginData.id;
      
      console.log(`✅ Successfully logged in as user ID: ${userId}`);
      
      // Test 5: Stake tokens
      console.log(`\nTest 5: Staking tokens in pool ${testPoolId}...`);
      const stakeData = {
        poolId: testPoolId,
        amount: "5.0",
        autoCompoundEnabled: true
      };
      
      const stakeResponse = await fetch('http://localhost:5000/api/staking/stake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(stakeData)
      });
      
      if (!stakeResponse.ok) {
        console.log(`⚠️ Staking failed: ${stakeResponse.status} ${stakeResponse.statusText}`);
        const errorText = await stakeResponse.text();
        console.log(`Error details: ${errorText}`);
      } else {
        const stakeResult = await stakeResponse.json();
        console.log(`✅ Successfully staked tokens with position ID: ${stakeResult.id}`);
        const positionId = stakeResult.id;
        
        // Test 6: Get user positions
        console.log('\nTest 6: Fetching user staking positions...');
        const positionsResponse = await fetch('http://localhost:5000/api/staking/positions', {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        
        if (!positionsResponse.ok) {
          throw new Error(`Failed to fetch user positions: ${positionsResponse.status} ${positionsResponse.statusText}`);
        }
        
        const positions = await positionsResponse.json();
        console.log(`✅ Successfully fetched ${positions.length} user positions`);
        
        // Test 7: Claim rewards
        console.log(`\nTest 7: Claiming rewards from position ${positionId}...`);
        const claimData = {
          positionId,
          amount: "0.1"
        };
        
        const claimResponse = await fetch('http://localhost:5000/api/staking/rewards/claim', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify(claimData)
        });
        
        if (!claimResponse.ok) {
          console.log(`⚠️ Claiming rewards failed: ${claimResponse.status} ${claimResponse.statusText}`);
          const errorText = await claimResponse.text();
          console.log(`Error details: ${errorText}`);
        } else {
          const claimResult = await claimResponse.json();
          console.log(`✅ Successfully claimed rewards: ${JSON.stringify(claimResult)}`);
        }
        
        // Test 8: Unstake tokens
        console.log(`\nTest 8: Unstaking from position ${positionId}...`);
        const unstakeData = {
          positionId
        };
        
        const unstakeResponse = await fetch('http://localhost:5000/api/staking/unstake', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify(unstakeData)
        });
        
        if (!unstakeResponse.ok) {
          console.log(`⚠️ Unstaking failed: ${unstakeResponse.status} ${unstakeResponse.statusText}`);
          const errorText = await unstakeResponse.text();
          console.log(`Error details: ${errorText}`);
        } else {
          const unstakeResult = await unstakeResponse.json();
          console.log(`✅ Successfully unstaked tokens: ${JSON.stringify(unstakeResult)}`);
        }
      }
    }
    
    console.log('\n=== Staking API Tests Completed ===\n');
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

// Run the tests
testStakingAPI();