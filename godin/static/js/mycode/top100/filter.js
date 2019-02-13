/*
  autocomplete(document.getElementById("myInput"), names, true);
*/

class AutoComplete {
    constructor(_element, _tipo) {
        this.element = document.getElementById(_element);
        this.tipo = _tipo;
        this.clicked = false;
        this.formatDate = d3.timeParse("%Y");
        this.currentFocus = -1;
        this.initVis();
        
    }

    initVis() {
        let vis = this;
        
        
        vis.wrangleData(null);
    }

    wrangleData(e) {
        let vis = this;


        
        
        vis.yearStart = vis.formatDate(document.getElementById("dateLabel1").innerText);;
        vis.yearEnd = vis.formatDate(document.getElementById("dateLabel2").innerText);;

        vis.data = formattedData.features.filter(d => {
            return (
                d.geometry &&
                (+vis.formatDate(d.properties.year) <= +vis.yearEnd)
                && (+vis.formatDate(d.properties.year) >= +vis.yearStart));
        });

        if (filterName) {
            vis.data = vis.data.filter(d => d.properties.name == filterName);
            
        }
        if (filterCat) {
            vis.data = vis.data.filter(d => d.properties.cat.includes(filterCat));
        }
        if (vis.tipo == "name") {
            vis.data = vis.data.map(d => d.properties.name);
        }
        else {
            vis.data = catArray.filter(
                d => [].concat(...vis.data.map(d=>d.properties.cat)).includes(catMap[d]));
        }
        if(e ){
          vis.update(e);
        }
        

    }

    update(e) {
        let vis = this;
        let val = vis.element.value;
        
        if(!keyDown){
            vis.closeAllLists();
            vis.a = document.createElement("DIV");
            vis.a.setAttribute("id", vis.element.id + "autocomplete-list");
            vis.a.setAttribute("class", "autocomplete-items");
            vis.element.parentNode.appendChild(vis.a);
        }

        if (vis.clicked) {
            for (let i = 0; i < vis.data.length; i++) {
                /*check if the item starts with the same letters as the text field value:*/
                if (
                    (vis.data[i].substr(0, val.length).toUpperCase() == val.toUpperCase() || !val)
                ) { 
                    /*create a DIV element for each matching element:*/
                    vis.b = document.createElement("DIV");
                    /*make the matching letters bold:*/
                    vis.b.innerHTML = "<strong>" + vis.data[i].substr(0, val.length) + "</strong>";
                    vis.b.innerHTML += vis.data[i].substr(val.length);
                    /*insert a input field that will hold the current array item's value:*/
                    vis.b.innerHTML += "<input type='hidden' value='" + vis.data[i] + "'>";
                    /*execute a function when someone clicks on the item value (DIV element):*/
                    vis.b.addEventListener("click", function (e) {
                        
                        /*insert the value for the autocomplete text field:*/
                        vis.element.value = this.getElementsByTagName("input")[0].value;
                        /*close the list of autocompleted values,
                        (or any other open lists of autocompleted values:*/
                        vis.closeAllLists();
                    });
                    vis.a.appendChild(vis.b);
                }
            }
            vis.clicked = false;
        }
        else {
            
            vis.x = document.getElementById(vis.element.id + "autocomplete-list");
            if (vis.x) vis.x = vis.x.getElementsByTagName("div");
            if (e.key == "ArrowDown") {
                /*If the arrow DOWN key is pressed,
                increase the currentFocus variable:*/
                vis.currentFocus++;
                /*and and make the current item more visible:*/
                vis.addActive(vis.x);
            } else if (e.key == "ArrowUp") { //up
                /*If the arrow UP key is pressed,
                decrease the currentFocus variable:*/
                vis.currentFocus--;
                /*and and make the current item more visible:*/
                vis.addActive(vis.x);
            } else if (e.key == "Enter") {
                /*If the ENTER key is pressed, prevent the form from being submitted,*/
                e.preventDefault();
                if (vis.currentFocus > -1) {
                    /*and simulate a click on the "active" item:*/
                    if (vis.x) vis.x[vis.currentFocus].click();
                }
            }
            vis.inputed = false;
        }



    }

    addActive(x) {
        
        

        let vis = this;
        
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        vis.removeActive(x);
        if (vis.currentFocus >= x.length) vis.currentFocus = 0;

        if (vis.currentFocus < 0) vis.currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[vis.currentFocus].classList.add("autocomplete-active");
    }

    removeActive(x) {
        let vis = this;
  
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    closeAllLists(elmnt) {
        let vis = this;

        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        let x = document.getElementsByClassName("autocomplete-items");

        for (var i = 0; i < x.length; i++) {

            if (elmnt != vis.element && elmnt != x[i] && elmnt != document.getElementById("myInput2")) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
}









