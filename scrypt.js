document.addEventListener('DOMContentLoaded', function () {
    let price = 19;
    let cid = [
        ['PENNY', 1.01],
        ['NICKEL', 2.05],
        ['DIME', 3.1],
        ['QUARTER', 4.25],
        ['ONE', 90],
        ['FIVE', 55],
        ['TEN', 20],
        ['TWENTY', 60],
        ['ONE HUNDRED', 100]
      ];

    const cash = document.getElementById('cash');
    const change = document.getElementById('change-due');
    const sale = document.getElementById('purchase-btn');

    sale.addEventListener("click", () => {
        const cashValue = parseFloat(cash.value);

        // Validate input
        if (isNaN(cashValue)) {
            change.innerHTML = "Please enter a valid amount.";
            return;
        }

        const changeDue = cashValue - price;

        if (cashValue < price) {
            alert("Customer does not have enough money to purchase the item");
            change.innerHTML = "";
        } else if (cashValue === price) {
            change.innerHTML = "No change due - customer paid with exact cash";
        } else {
            change.innerHTML = `Status: OPEN <br> Change Due: $${changeDue.toFixed(2)}`;
        }

        const getChange = (changeDue, cid) => {
            let totalCid = parseFloat(cid.reduce((sum, [_,ammount]) => sum + ammount, 0).toFixed(2));
            console.log(totalCid);
            if (totalCid < changeDue) {
                return  {Status: INSUFFICIENT_FUNDS, change: []};
                
            } else if (totalCid === changeDue) {
                return {Status: CLOSED, change: []};
                
            }
        }
        //getChange(.5,cid);
    });
});
