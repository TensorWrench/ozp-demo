$(document).ready(function(){function b(){OWF.DragAndDrop.setDropEnabled(true)}function a(){OWF.DragAndDrop.setDropEnabled(false)}OWF.ready(function(){var e=$("#start-address"),d=$("#end-address"),c=$(".owf-drop-zone");$("#navigate").on("click",function(f){f.preventDefault();OWF.Intents.startActivity({action:"navigate",dataType:"application/vnd.owf.sample.addresses"},[e.val(),d.val()],function(g){})});OWF.DragAndDrop.onDragStart(function(){c.addClass("highlight-drop-zone");c.on("mouseover",b);c.on("mouseout",a)});OWF.DragAndDrop.onDragStop(function(){c.removeClass("highlight-drop-zone");c.off("mouseover",b);c.off("mouseout",a)});OWF.DragAndDrop.addDropZoneHandler({dropZone:e[0],handler:function(f){e.val(f.dragDropData.address)}});OWF.DragAndDrop.addDropZoneHandler({dropZone:d[0],handler:function(f){d.val(f.dragDropData.address)}})})});