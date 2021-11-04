/**
 * placss - plasterlang interpretation of how html and css should be combined for certain layout features
 */

function placss() {
    //Run attribute checks on containers for extra alignment info
    flexContainers();
    gridContainers();
    fitContent();
    spacers();
    fixNavs();
    window.addEventListener("resize",function() {
        fitContent();
        fixNavs();
    });
    window.addEventListener("scroll",function() {
        stickyNav();
    });
}

/**PRIVATE FUNCTIONS */
function flexContainers() {
    let flexContainers = document.querySelectorAll("flex");
    let flexChildren = document.querySelectorAll("flex > *");
    flexContainers.forEach(container => {
        //Set general property arrays for special parsing
        let vprops = ["start","end","center","baseline","space-between","space-around","space-evenly"];
        let hprops = ["start","end","center","stretch","baseline"];

        //Set flow
        container.style.flexFlow = container.hasAttribute("flow") ? container.getAttribute("flow") : "initial";
        
        if(container.hasAttribute("row")) container.style.flexDirection = "row";
        
        if(container.hasAttribute("row-reverse")) container.style.flexDirection = "row-reverse";
        
        if(container.hasAttribute("column")) container.style.flexDirection = "column";
        
        if(container.hasAttribute("column-reverse")) container.style.flexDirection = "column-reverse";
        
        if(container.hasAttribute("fdir")) container.style.flexDirection = container.getAttribute("fdir");

        container.style.flexWrap = container.hasAttribute("wrap") ? "wrap" : "nowrap";

        //Set justification
        container.style.justifyContent = container.hasAttribute("justify") ? container.getAttribute("justify") : "initial";

        //Set Vertical Alignment
        if(container.hasAttribute("v-align")) {
            if(container.getAttribute("v-align").indexOf(" ") > -1) {
                let values = container.getAttribute("v-align").split(" ");
                container.style.alignContent = values[0];
                container.style.justifyContent = values[1];
            } else {
                vprops.forEach(prop => {
                    if(container.getAttribute("v-align") === prop) {
                        container.style.alignContent = prop;
                        container.style.justifyContent = prop;
                    }
                });
            }
        }

        //Set Horizontal Alignment
        if(container.hasAttribute("h-align")) {
            if(container.getAttribute("h-align").indexOf(" ") > -1) {
                let values = container.getAttribute("h-align").split(" ");
                container.style.alignItems = values[0];
                container.style.justifyItems = values[1];
            } else {
                hprops.forEach(prop => {
                    if(container.getAttribute("h-align") === prop) {
                        container.style.alignItems = prop;
                        container.style.justifyItems = prop;
                    }
                });
            }
        }
    });
    //Go through children
    flexChildren.forEach(child => {
        child.style.order = child.hasAttribute("order") ? child.getAttribute("order") : "initial";
        child.style.flex = child.hasAttribute("flex-size") ? child.getAttribute("flex-size") : "initial";
    });
}
function gridContainers() {
    let gridContainers = document.querySelectorAll("grid");
    let gridChildren = document.querySelectorAll("grid > *");
    gridContainers.forEach(current => {
        //Run attribute checks for grid element
        if(current.hasAttribute("cols")) {
            // console.log("Attr cols: ", current.getAttribute("cols"));
            if(current.getAttribute("cols") === "auto") {
                //automatically count the children and insert auto
                //For the count of the children
                let auto = "auto";
                for(let j = 0; j < gridChildren.length; j++) {
                    auto += " auto";
                }
                current.style.gridTemplateColumns = auto;
            } else {
                current.style.gridTemplateColumns = current.getAttribute("cols");
            }
        }
        if(current.hasAttribute("rows")) {
            // console.log("Attr rows: ", current.getAttribute("rows"));
            if(current.getAttribute("rows") === "auto") {
                //automatically count the children and insert auto
                //For the count of the children
                let auto = "auto";
                for(let j = 0; j < gridChildren.length; j++) {
                    auto += " auto";
                }
                current.style.gridTemplateRows = auto;
            } else {
                current.style.gridTemplateRows = current.getAttribute("rows");
            }
            
        }
        current.style.gap = current.hasAttribute("gap") ? current.getAttribute("gap") : "initial";

        if(current.hasAttribute("fill")) {
            // console.log("Attr stretch: ", true);
            current.style.justifyItems = "stretch";
            current.style.alignItems = "stretch";
        }
    });
    //Run inner child loop for grid element
    gridChildren.forEach(child => {
        child.style.gridColumn = child.hasAttribute("colspan") ? child.getAttribute("colspan") : "initial";
        current.style.gridRow = current.hasAttribute("rowspan") ? current.getAttribute("rowspan") : "initial";
    });
}
function fitContent() {
    let main = document.querySelector('main');
    if(main != undefined) {
        let mainHeight = main.offsetHeight;

        main.children[0].style.height = `${mainHeight}px`;
    }
}
function spacers() {
    //Grab spacer elements
    let spacers = document.querySelectorAll("spacer");
    let parseDecFrac = (num) => {
        let unit = "px"; //default
        if(num.search(/(%|em|rem|fr|vw|vh|px)/) > -1) {
            //Custom Units
            //Return asap
            return num;
        } else {
            //Continue working with default units
            if(num.indexOf("/") > -1) {
                unit = "%";
                //Number is a fraction convert to JS number
                num = num.split("/");
                num = (Number(num[0]) / Number(num[1]))*100;
            } else if(num.indexOf(".") > -1) {
                unit = "%";
                //Number is a decimal just convert
                num = Number(num)*100;
            }

            return num + unit;
        }
    };

    //Check for attributes
    if(spacers != undefined) {
        spacers.forEach(current => {
            if(current.hasAttribute("w")) {
                //Spacer has a specific width to be set to
                current.style.width = parseDecFrac(current.getAttribute("w"));
            } else {
                //Spacer has no width, inherit from parent, check for height
                current.style.width = current.parentElement.offsetWidth + "px";
            }
            if(current.hasAttribute("h")) {
                //Spacer has specific height
                current.style.height = parseDecFrac(current.getAttribute("h"));
            } else {
                //Spacer has no height inherit from parent
                current.style.height = current.parentElement.offsetHeight + "px";
            }
        });
    }
}
function fixNavs() {
    if(document.querySelector('nav') != undefined) {
        //A form of nav exists
        let items = document.querySelectorAll('nav > container > item');
        items.forEach(function(item){
            item.style.width = `${100/items.length}%`;
        });

        let nav = document.querySelectorAll('nav.submenus')[0];
        let headerHeight = document.querySelectorAll('header')[0].offsetHeight;
        if(nav !== null) {
            nav.style.top = `${headerHeight}px`;
            document.querySelectorAll('main')[0].style.paddingTop = `${headerHeight}px`;
        }
    }
}
function stickyNav() {
    if(document.querySelector('nav') != undefined) {
        let nav = document.querySelectorAll('nav')[0];
        let headerHeight = document.querySelectorAll('header')[0].offsetHeight;
        // console.log(document.body.scrollTop || document.documentElement.scrollTop);

        if(document.body.scrollTop >= headerHeight || document.documentElement.scrollTop >= headerHeight) {
            nav.style.position = "fixed";
            nav.style.top = 0;
        } else {
            nav.style.position = "absolute";
            nav.style.top = `${headerHeight}px`;
        }
    }
}

//Add dependency to list
addDeps(true, placss);