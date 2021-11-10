//Handle displaying the modals
function showShop() {
    $("#themeModal").css('display','none');
    $("#upgradeModal").css('display','none');
    $("#shopModal").css('display','block');
    setTimeout(() => {
        $("#shopModal").css('opacity','1');
    },10);
}
function hideShop() {
    $("#shopModal").css('opacity','0');
    setTimeout(() => {
        $("#shopModal").css('display','none');
    },300);
}
function showUpgrades() {
    $("#themeModal").css('display','none');
    $("#shopModal").css('display','none');
    $("#upgradeModal").css('display','block');
    setTimeout(() => {
        $("#upgradeModal").css('opacity','1');
    },10);
}
function hideUpgrades() {
    $("#upgradeModal").css('opacity','0');
    setTimeout(() => {
        $("#upgradeModal").css('display','none');
    },300);
}
function showThemes() {
    $("#shopModal").css('display','none');
    $("#upgradeModal").css('display','none');
    $("#themeModal").css('display','block');
    setTimeout(() => {
        $("#themeModal").css('opacity','1');
    },10);
}
function hideThemes() {
    $("#themeModal").css('opacity','0');
    setTimeout(() => {
        $("#themeModal").css('display','none');
    },300);
}

//Handle Item Content Creation
function createList(container) {
    if(container != undefined) {
        switch(container) {
            case "shop":
                app.data.shop.forEach(item => {
                    $("#shopModal","elem")[0].innerHTML +=
    `<section>
        <h4>${item.displayName}</h4><br>
        <p>${item.desc}</p><br>
        <span id="${item.name}Qty">Quantity: ${item.qty}</span>
        <span id="${item.name}Cost">Cost: ${item.cost}</span><br>
        <a href="javascript:void(0);" class="buyBtn" onclick="updateCounters(${item})">Buy</a>
    </section>`;
                });
        }
    }
}