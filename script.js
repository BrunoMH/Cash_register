document.addEventListener('DOMContentLoaded', function () {
    let price = 19.5; // Example price of the item
    let cid = [
        ["PENNY", 1.01],
        ["NICKEL", 2.05],
        ["DIME", 3.1],
        ["QUARTER", 4.25],
        ["ONE", 90],
        ["FIVE", 55],
        ["TEN", 20],
        ["TWENTY", 60],
        ["ONE HUNDRED", 100]
    ];

    const cashInput = document.getElementById('cash');
    const changeDueDiv = document.getElementById('change-due');
    const purchaseBtn = document.getElementById('purchase-btn');

    purchaseBtn.addEventListener('click', function() {
        const cashValue = parseFloat(cashInput.value);
        const changeDue = cashValue - price;

        if (cashValue < price) {
            alert("Customer does not have enough money to purchase the item");
            return;
        }

        if (cashValue === price) {
            changeDueDiv.innerText = "No change due - customer paid with exact cash";
            return;
        }

        const changeResult = checkCashRegister(price, cashValue, cid);
        changeDueDiv.innerText = formatResult(changeResult);
    });

    function checkCashRegister(price, cash, cid) {
        const currencyUnit = {
            "PENNY": 0.01,
            "NICKEL": 0.05,
            "DIME": 0.1,
            "QUARTER": 0.25,
            "ONE": 1,
            "FIVE": 5,
            "TEN": 10,
            "TWENTY": 20,
            "ONE HUNDRED": 100
        };

        let changeDue = cash - price;
        // Round to deal with floating point precision
        changeDue = Math.round(changeDue * 100) / 100;
        
        // Calculate total cash in drawer
        const totalCid = cid.reduce((sum, [, amount]) => sum + amount, 0).toFixed(2);
        
        // Make a deep copy of the cid array to avoid modifying the original
        const register = JSON.parse(JSON.stringify(cid));
        
        // Handle CLOSED case
        if (parseFloat(totalCid) === changeDue) {
            // Even for CLOSED case, calculate the exact change
            const change = [];
            // Loop through currency units from highest to lowest to calculate change
            for (let i = register.length - 1; i >= 0; i--) {
                const [unit, amount] = register[i];
                const unitValue = currencyUnit[unit];
                let unitAmount = 0;
                
                // Calculate how many of this unit we can use
                while (changeDue >= unitValue && amount > unitAmount) {
                    changeDue -= unitValue;
                    // Round to fix floating point precision issues
                    changeDue = Math.round(changeDue * 100) / 100;
                    unitAmount += unitValue;
                    unitAmount = Math.round(unitAmount * 100) / 100;
                }
                
                // Add unit to change array (even if 0 for CLOSED status)
                change.push([unit, unitAmount]);
            }
            
            // For CLOSED status, we need to return all denominations exactly as they are in the drawer
            return { status: "CLOSED", change: register };
        }
        
        // Check if we can provide change
        const change = [];
        // Loop through currency units from highest to lowest
        for (let i = register.length - 1; i >= 0; i--) {
            const [unit, amount] = register[i];
            const unitValue = currencyUnit[unit];
            let unitAmount = 0;
            
            // Calculate how many of this unit we can use
            while (changeDue >= unitValue && amount > unitAmount) {
                changeDue -= unitValue;
                // Round to fix floating point precision issues
                changeDue = Math.round(changeDue * 100) / 100;
                unitAmount += unitValue;
                unitAmount = Math.round(unitAmount * 100) / 100;
            }
            
            // If we used any of this unit, add it to our change array
            if (unitAmount > 0) {
                change.push([unit, unitAmount]);
            }
        }
        
        // If we couldn't provide exact change
        if (changeDue > 0) {
            return { status: "INSUFFICIENT_FUNDS", change: [] };
        }
        
        return { status: "OPEN", change };
    }

    function formatResult(result) {
        if (result.status === "INSUFFICIENT_FUNDS") {
            return "Status: INSUFFICIENT_FUNDS";
        } else if (result.status === "CLOSED") {
            return "Status: CLOSED " + result.change
                .filter(([, amount]) => amount > 0)
                .map(([unit, amount]) => `${unit}: $${amount}`)
                .join(" ");
        } else {
            return "Status: OPEN " + result.change
                .map(([unit, amount]) => `${unit}: $${amount}`)
                .join(" ");
        }
    }
});