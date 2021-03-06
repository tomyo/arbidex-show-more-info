function showHideMoreInfo() {
  if (typeof window.ABXnodesAdded !== 'undefined') {
    // If script was executed, clean previous work
    window.ABXnodesAdded.forEach(node => node.remove());
    delete window.ABXnodesAdded;
    return
  }
  window.ABXnodesAdded = []  // Global variable to store added nodes to DOM

  function createTextNode(text) {
    let result = document.createElement("span");
    result.appendChild(document.createTextNode(text));
    window.ABXnodesAdded.push(result);
    return result
  }

  //First, open arbitrage table if is not visible in UI
  const arbitrageSection = document.querySelector(
    "main > div > div:nth-child(5)"
  );
  if (arbitrageSection.children.length < 2) {
    // Lets open table clicking the button
    arbitrageSection.children[0].click();
  }

  let tables = document.querySelectorAll(".rt-table");

  // Overview table
  const btcRow = tables[0].querySelector(".rt-tbody .rt-tr-group:nth-child(2)");
  const ehtRow = tables[0].querySelector(".rt-tbody .rt-tr-group:nth-child(3)");
  const btcInArb = Number(btcRow.querySelector(".rt-ar:nth-child(4)").innerText);
  const ehtInArb = Number(ehtRow.querySelector(".rt-ar:nth-child(4)").innerText);

  // Arbitrage History table (last one)
  const arbHistoryTable = tables[tables.length - 1];

  // Add table header row title
  const siblin = arbHistoryTable.querySelector(".rt-thead .rt-th:nth-child(2)");
  siblin.insertAdjacentElement("afterend", createTextNode("Total (%)"));

  const rows = arbHistoryTable.querySelectorAll(".rt-tbody .rt-tr");

  // Calculate and add new cell values
  let currTotal;
  let ethTotal = ehtInArb;
  let btcTotal = btcInArb;
  rows.forEach(row => {
    let symbol = row.querySelector(":nth-child(2) > span").innerText;
    let ammount = Number(row.querySelector(":nth-child(3) > span").innerText);
    let type = row.querySelector(":nth-child(4) > span").innerText;
    let cellToAppendSiblin = row.querySelector(":nth-child(2)");
    currTotal = getCurrentTotal(symbol);
    if (type === "To Deposit") {
      ammount *= -1; // Page shows withdraw to deposit as positive numbers, fixing.
    }
    let percentage = (ammount / (currTotal - ammount)) * 100;
    let node = createTextNode(`${currTotal.toFixed(4)} (${percentage.toFixed(4)} %)`)
    cellToAppendSiblin.insertAdjacentElement("afterend", node);
    setCurrentTotal(symbol, currTotal - ammount);
  });

  function getCurrentTotal(symbol) {
    if (symbol == "BTC") {
      return btcTotal;
    }
    return ethTotal;
  }

  function setCurrentTotal(symbol, newTotal) {
    if (symbol == "BTC") {
      btcTotal = newTotal;
    } else {
      ethTotal = newTotal;
    }
  }
}
showHideMoreInfo();
