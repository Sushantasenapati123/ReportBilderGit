

// custom js Here  


$(document).ready(function() {


    new WOW().init();

    
    $('.dropdown__custom').click(function(e) {
        e.stopPropagation();
        $('.dropdown-menu').toggleClass('show');
      });
    
      $(document).click(function() {
        $('.dropdown-menu').removeClass('show');
      });
    
      $('.dropdown-menu').click(function(e) {
        e.stopPropagation();
      });


    $(".dropdown__custom .nav-link").click(function(){
        $(".dropdown-menu").slideToggle();
      });


    document.getElementById('tab1').addEventListener('change', function() {
       if (this.checked) {
           document.getElementById('content1').classList.remove('hidden');
           document.getElementById('content2').classList.add('hidden');
       }
   });

   document.getElementById('tab2').addEventListener('change', function() {
       if (this.checked) {
           document.getElementById('content1').classList.add('hidden');
           document.getElementById('content2').classList.remove('hidden');
       }
   });


   var toggleDashboard = document.querySelector('.b-dashboard-toggler');
   var dashbrdGroups = document.getElementById('dashbrdGroups');
   var colRight = document.getElementById('colRight');

   toggleDashboard.addEventListener('click', function() {
       dashbrdGroups.classList.toggle('hidden');
       colRight.classList.toggle('full-display');
   });



   $('.b-dashboard-menu a').click(function() {
       var link = $(this);
       var closest_ul = link.closest("ul");
       var parallel_active_links = closest_ul.find(".-is-active")
       var closest_li = link.closest("li");
       var link_status = closest_li.hasClass("-is-active");
       var count = 0;

       closest_ul.find("ul").slideUp(function() {
           if (++count == closest_ul.find("ul").length)
               parallel_active_links.removeClass("-is-active");
       });

       if (!link_status) {
           closest_li.children("ul").slideDown();
           closest_li.addClass("-is-active");
       }
   });

   function fct_makeResizableDiv(div) {
       const element = document.querySelector(div);
       const resizer = document.querySelectorAll(div + ' .b-dashboard-resizer')
       const minimum_size = 20;
       let original_width = 0;
       let original_height = 0;
       let original_x = 0;
       let original_y = 0;
       let original_mouse_x = 0;
       let original_mouse_y = 0;
       for (let i = 0;i < resizer.length; i++) {
           const currentResizer = resizer[i];
           currentResizer.addEventListener('mousedown', function(e) {
               e.preventDefault()
               original_width = parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('px', ''));
               original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
               original_x = element.getBoundingClientRect().left;
               original_y = element.getBoundingClientRect().top;
               original_mouse_x = e.pageX;
               original_mouse_y = e.pageY;
               window.addEventListener('mousemove', fct_resize)
               window.addEventListener('mouseup', fct_stopResize)
           })

           function fct_resize(e) {      
                   const width = original_width + (e.pageX - original_mouse_x)
                   if (width > minimum_size) { element.style.width = width + 'px' }
               
           }

           function fct_stopResize() { window.removeEventListener('mousemove', fct_resize); }
       }
   } /* fct_makeResizableDiv */
   fct_makeResizableDiv('#dashbrdGroups');
   
   
}); 


// custom js Here  



















// drawflow js start here


var id = document.getElementById("drawflow");
const editor = new Drawflow(id);
editor.reroute = true;
const dataToImport =
{
    "drawflow": {
        "Home": {
            "data": {

                "4": {
                    "id": 4,
                    "name": "email",
                    "data": {}
                    ,
                    "class": "email",
                    "html": "\n            <div>\n              <div class=\"title-box\"><i class=\"fas fa-at\"></i> Send Email </div>\n            </div>\n            ",
                    "typenode": false,
                    "inputs": {
                        "input_1": {
                            "connections": [ {
                                "node": "5", "input": "output_1"
                            }
                            ]
                        }
                    }
                    ,
                    "outputs": {}
                    ,
                    "pos_x": 1033,
                    "pos_y": 439
                }
                ,
                "5": {
                    "id": 5,
                    "name": "template",
                    "data": {
                        "template": "Write your template"
                    }
                    ,
                    "class": "template",
                    "html": "\n            <div>\n              <div class=\"title-box\"><i class=\"fas fa-code\"></i> Template</div>\n              <div class=\"box\">\n                Ger Vars\n                <textarea df-template></textarea>\n                Output template with vars\n              </div>\n            </div>\n            ",
                    "typenode": false,
                    "inputs": {
                        "input_1": {
                            "connections": [ {
                                "node": "6", "input": "output_1"
                            }
                            ]
                        }
                    }
                    ,
                    "outputs": {
                        "output_1": {
                            "connections": [ {
                                "node": "4", "output": "input_1"
                            }
                            ,
                                {
                                "node": "11", "output": "input_1"
                            }
                            ]
                        }
                    }
                    ,
                    "pos_x": 607,
                    "pos_y": 304
                }
               
                ,
                "7": {
                    "id": 7,
                    "name": "facebook",
                    "data": {}
                    ,
                    "class": "facebook",
                    "html": "\n        <div>\n          <div class=\"title-box\"><i class=\"fab fa-facebook\"></i> Facebook Message</div>\n        </div>\n        ",
                    "typenode": false,
                    "inputs": {}
                    ,
                    "outputs": {
                        "output_1": {
                            "connections": [ {
                                "node": "2", "output": "input_1"
                            }
                            ,
                                {
                                "node": "3", "output": "input_1"
                            }
                            ,
                                {
                                "node": "11", "output": "input_1"
                            }
                            ]
                        }
                    }
                    ,
                    "pos_x": 347,
                    "pos_y": 87
                }
                ,
                "11": {
                    "id": 11,
                    "name": "log",
                    "data": {}
                    ,
                    "class": "log",
                    "html": "\n            <div>\n              <div class=\"title-box\"><i class=\"fas fa-file-signature\"></i> Save log file </div>\n            </div>\n            ",
                    "typenode": false,
                    "inputs": {
                        "input_1": {
                            "connections": [ {
                                "node": "5", "input": "output_1"
                            }
                            ,
                                {
                                "node": "7", "input": "output_1"
                            }
                            ]
                        }
                    }
                    ,
                    "outputs": {}
                    ,
                    "pos_x": 1031,
                    "pos_y": 363
                }
            }
        }
        ,
        "Other": {
            "data": {
                "8": {
                    "id": 8,
                    "name": "personalized",
                    "data": {}
                    ,
                    "class": "personalized",
                    "html": "\n            <div>\n              Personalized\n            </div>\n            ",
                    "typenode": false,
                    "inputs": {
                        "input_1": {
                            "connections": [ {
                                "node": "12", "input": "output_1"
                            }
                            ,
                                {
                                "node": "12", "input": "output_2"
                            }
                            ,
                                {
                                "node": "12", "input": "output_3"
                            }
                            ,
                                {
                                "node": "12", "input": "output_4"
                            }
                            ]
                        }
                    }
                    ,
                    "outputs": {
                        "output_1": {
                            "connections": [ {
                                "node": "9", "output": "input_1"
                            }
                            ]
                        }
                    }
                    ,
                    "pos_x": 764,
                    "pos_y": 227
                }
                ,
                "9": {
                    "id": 9,
                    "name": "dbclick",
                    "data": {
                        "name": "Hello World!!"
                    }
                    ,
                    "class": "dbclick",
                    "html": "\n            <div>\n            <div class=\"title-box\"><i class=\"fas fa-mouse\"></i> Db Click</div>\n              <div class=\"box dbclickbox\" ondblclick=\"showpopup(event)\">\n                Db Click here\n                <div class=\"modal\" style=\"display:none\">\n                  <div class=\"modal-content\">\n                    <span class=\"close\" onclick=\"closemodal(event)\">&times;</span>\n                    Change your variable {name} !\n                    <input type=\"text\" df-name>\n                  </div>\n\n                </div>\n              </div>\n            </div>\n            ",
                    "typenode": false,
                    "inputs": {
                        "input_1": {
                            "connections": [ {
                                "node": "8", "input": "output_1"
                            }
                            ]
                        }
                    }
                    ,
                    "outputs": {
                        "output_1": {
                            "connections": [ {
                                "node": "12", "output": "input_2"
                            }
                            ]
                        }
                    }
                    ,
                    "pos_x": 209,
                    "pos_y": 38
                }
                ,
                "12": {
                    "id": 12,
                    "name": "multiple",
                    "data": {}
                    ,
                    "class": "multiple",
                    "html": "\n            <div>\n              <div class=\"box\">\n                Multiple!\n              </div>\n            </div>\n            ",
                    "typenode": false,
                    "inputs": {
                        "input_1": {
                            "connections": []
                        }
                        ,
                        "input_2": {
                            "connections": [ {
                                "node": "9", "input": "output_1"
                            }
                            ]
                        }
                        ,
                        "input_3": {
                            "connections": []
                        }
                    }
                    ,
                    "outputs": {
                        "output_1": {
                            "connections": [ {
                                "node": "8", "output": "input_1"
                            }
                            ]
                        }
                        ,
                        "output_2": {
                            "connections": [ {
                                "node": "8", "output": "input_1"
                            }
                            ]
                        }
                        ,
                        "output_3": {
                            "connections": [ {
                                "node": "8", "output": "input_1"
                            }
                            ]
                        }
                        ,
                        "output_4": {
                            "connections": [ {
                                "node": "8", "output": "input_1"
                            }
                            ]
                        }
                    }
                    ,
                    "pos_x": 179,
                    "pos_y": 272
                }
            }
        }
    }
}




editor.start();
editor.import(dataToImport);


// Events!
editor.on('nodeCreated', function (id) {
    console.log("Node created " + id);
})

editor.on('nodeRemoved', function (id) {
    console.log("Node removed " + id);
})

editor.on('nodeSelected', function (id) {
    console.log("Node selected " + id);
})

editor.on('moduleCreated', function (name) {
    console.log("Module Created " + name);
})

editor.on('moduleChanged', function (name) {
    console.log("Module Changed " + name);
})

editor.on('connectionCreated', function (connection) {
    console.log('Connection created');
    console.log(connection);
})

editor.on('connectionRemoved', function (connection) {
    console.log('Connection removed');
    console.log(connection);
})

editor.on('mouseMove', function (position) {
    console.log('Position mouse x:' + position.x + ' y:' + position.y);
})

editor.on('nodeMoved', function (id) {
    console.log("Node moved " + id);
})

editor.on('zoom', function (zoom) {
    console.log('Zoom level ' + zoom);
})

editor.on('translate', function (position) {
    console.log('Translate x:' + position.x + ' y:' + position.y);
})

editor.on('addReroute', function (id) {
    console.log("Reroute added " + id);
})

editor.on('removeReroute', function (id) {
    console.log("Reroute removed " + id);
})

/* DRAG EVENT */

/* Mouse and Touch Actions */

var elements = document.getElementsByClassName('drag-drawflow');
for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener('touchend', drop, false);
    elements[i].addEventListener('touchmove', positionMobile, false);
    elements[i].addEventListener('touchstart', drag, false);
}

var mobile_item_selec = '';
var mobile_last_move = null;
function positionMobile(ev) {
    mobile_last_move = ev;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    if (ev.type === "touchstart") {
        mobile_item_selec = ev.target.closest(".drag-drawflow").getAttribute('data-node');
    } else {
        ev.dataTransfer.setData("node", ev.target.getAttribute('data-node'));
    }
}

function drop(ev) {
    if (ev.type === "touchend") {
        var parentdrawflow = document.elementFromPoint(mobile_last_move.touches[0].clientX, mobile_last_move.touches[0].clientY).closest("#drawflow");
        if (parentdrawflow != null) {
            addNodeToDrawFlow(mobile_item_selec, mobile_last_move.touches[0].clientX, mobile_last_move.touches[0].clientY);
        }
        mobile_item_selec = '';
    } else {
        ev.preventDefault();
        var data = ev.dataTransfer.getData("node");
        addNodeToDrawFlow(data, ev.clientX, ev.clientY);
    }

}

function addNodeToDrawFlow(name, pos_x, pos_y) {
    if (editor.editor_mode === 'fixed') {
        return false;
    }
    pos_x = pos_x * (editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)) - (editor.precanvas.getBoundingClientRect().x * (editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)));
    pos_y = pos_y * (editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)) - (editor.precanvas.getBoundingClientRect().y * (editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)));


    switch (name) {
        case 'facebook':
            var facebook = `
    <div class="drawflow_txt_scroll">
     <div class="drawflow_content_node">
     
        <div class="title-box"> <i class="bi bi-list"></i> Department (Human Resource) </div>
        <div class="box">

        <label class="form-check-label" for="flexCheckDefault">
          <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"/> Department ID
        </label>


        <label class="form-check-label" for="flexCheckDefault2">
          <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault2"/> Name
        </label>
        
        
        <label class="form-check-label" for="flexCheckDefault4">
          <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault4"/> Group Name
        </label>

         <label class="form-check-label" for="flexCheckDefault5">
          <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault5"/> Date
        </label>
         
         
        </div>
      </div>
    </div>
    `;
            editor.addNode('facebook', 0, 1, pos_x, pos_y, 'facebook', {}, facebook);
            break;
        case 'slack':
            var slackchat = `
            <div class="drawflow_txt_scroll">
            <div class="drawflow_content_node">
            
               <div class="title-box"> <i class="bi bi-list"></i> Department (Human Resource) </div>
               <div class="box">
       
               <label class="form-check-label" for="flexCheckDefault">
                 <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"/> Department ID
               </label>
       
       
               <label class="form-check-label" for="flexCheckDefault2">
                 <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault2"/> Name
               </label>
               
               
               <label class="form-check-label" for="flexCheckDefault4">
                 <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault4"/> Group Name
               </label>
       
                <label class="form-check-label" for="flexCheckDefault5">
                 <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault5"/> Date
               </label>
                
                
               </div>
             </div>
           </div>
      `
            editor.addNode('slack', 1, 0, pos_x, pos_y, 'slack', {}, slackchat);
            break;
        case 'github':
            var githubtemplate = `
     
      `;
            editor.addNode('github', 0, 1, pos_x, pos_y, 'github', { "name": '' }, githubtemplate);
            break;
        case 'telegram':
            var telegrambot = `
      <div>
        <div class="title-box"><i class="fab fa-telegram-plane"></i> Telegram bot</div>
        <div class="box">
          <p>Send to telegram</p>
          <p>select channel</p>
          <select df-channel>
            <option value="channel_1">Channel 1</option>
            <option value="channel_2">Channel 2</option>
            <option value="channel_3">Channel 3</option>
            <option value="channel_4">Channel 4</option>
          </select>
        </div>
      </div>
      `;
            editor.addNode('telegram', 1, 0, pos_x, pos_y, 'telegram', { "channel": 'channel_3' }, telegrambot);
            break;
        case 'aws':
            var aws = `
      <div>
        <div class="title-box"><i class="fab fa-aws"></i> Aws Save </div>
        <div class="box">
          <p>Save in aws</p>
          <input type="text" df-db-dbname placeholder="DB name"><br><br>
          <input type="text" df-db-key placeholder="DB key">
          <p>Output Log</p>
        </div>
      </div>
      `;
            editor.addNode('aws', 1, 1, pos_x, pos_y, 'aws', { "db": { "dbname": '', "key": '' } }, aws);
            break;
        case 'log':
            var log = `
        <div>
          <div class="title-box"><i class="fas fa-file-signature"></i> Save log file </div>
        </div>
        `;
            editor.addNode('log', 1, 0, pos_x, pos_y, 'log', {}, log);
            break;
        case 'google':
            var google = `
        <div>
          <div class="title-box"><i class="fab fa-google-drive"></i> Google Drive save </div>
        </div>
        `;
            editor.addNode('google', 1, 0, pos_x, pos_y, 'google', {}, google);
            break;
        case 'email':
            var email = `
        <div>
          <div class="title-box"><i class="fas fa-at"></i> Send Email </div>
        </div>
        `;
            editor.addNode('email', 1, 0, pos_x, pos_y, 'email', {}, email);
            break;

        case 'template':
            var template = `
        <div>
          <div class="title-box"><i class="fas fa-code"></i> Template</div>
          <div class="box">
            Ger Vars
            <textarea df-template></textarea>
            Output template with vars
          </div>
        </div>
        `;
            editor.addNode('template', 1, 1, pos_x, pos_y, 'template', { "template": 'Write your template' }, template);
            break;
        case 'multiple':
            var multiple = `
        <div>
          <div class="box">
            Multiple!
          </div>
        </div>
        `;
            editor.addNode('multiple', 3, 4, pos_x, pos_y, 'multiple', {}, multiple);
            break;
        case 'personalized':
            var personalized = `
        <div>
          Personalized
        </div>
        `;
            editor.addNode('personalized', 1, 1, pos_x, pos_y, 'personalized', {}, personalized);
            break;
        case 'dbclick':
            var dbclick = `
        <div>
        <div class="title-box"><i class="fas fa-mouse"></i> Db Click</div>
          <div class="box dbclickbox" ondblclick="showpopup(event)">
            Db Click here
            <div class="modal" style="display:none">
              <div class="modal-content">
                <span class="close" onclick="closemodal(event)">&times;</span>
                Change your variable {name} !
                <input type="text" df-name>
              </div>

            </div>
          </div>
        </div>
        `;
            editor.addNode('dbclick', 1, 1, pos_x, pos_y, 'dbclick', { name: '' }, dbclick);
            break;

        default:
    }
}

var transform = '';
function showpopup(e) {
    e.target.closest(".drawflow-node").style.zIndex = "9999";
    e.target.children[0].style.display = "block";
    //document.getElementById("modalfix").style.display = "block";

    //e.target.children[0].style.transform = 'translate('+translate.x+'px, '+translate.y+'px)';
    transform = editor.precanvas.style.transform;
    editor.precanvas.style.transform = '';
    editor.precanvas.style.left = editor.canvas_x + 'px';
    editor.precanvas.style.top = editor.canvas_y + 'px';
    console.log(transform);

    //e.target.children[0].style.top  =  -editor.canvas_y - editor.container.offsetTop +'px';
    //e.target.children[0].style.left  =  -editor.canvas_x  - editor.container.offsetLeft +'px';
    editor.editor_mode = "fixed";

}

function closemodal(e) {
    e.target.closest(".drawflow-node").style.zIndex = "2";
    e.target.parentElement.parentElement.style.display = "none";
    //document.getElementById("modalfix").style.display = "none";
    editor.precanvas.style.transform = transform;
    editor.precanvas.style.left = '0px';
    editor.precanvas.style.top = '0px';
    editor.editor_mode = "edit";
}

function changeModule(event) {
    var all = document.querySelectorAll(".menu ul li");
    for (var i = 0; i < all.length; i++) {
        all[i].classList.remove('selected');
    }
    event.target.classList.add('selected');
}

function changeMode(option) {

    //console.log(lock.id);
    if (option == 'lock') {
        lock.style.display = 'none';
        unlock.style.display = 'block';
    } else {
        lock.style.display = 'block';
        unlock.style.display = 'none';
    }

}

// drawflow js end here
