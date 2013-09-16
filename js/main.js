

var listId="{68BAA1F6-7B43-4AAF-B821-B9575C263044}";

var viewByContact="{caf32849-a1fd-4c1e-bfa1-8cda07b9596a}";

var viewByDirector="{6f80fcc3-19c9-4fe8-a1a7-bf019074f419}";

var viewByVP="{d4a22faa-8635-4f79-a54f-102a2ee68635}";

var excelList="EXCEL Ideas";

var getListItems="GetListItems";

var url='https://teams.aexp.com/sites/teamsitewendy/WASTE/_vti_bin/owssvr.dll?cmd=DISPLAY&List={68BAA1F6-7B43-4AAF-B821-B9575C263044}&view={6f80fcc3-19c9-4fe8-a1a7-bf019074f419}&XMLDATA=TRUE';

var ActiveFlyout;

$().SPServices.defaults.webURL = "https://teams.aexp.com/sites/teamsitewendy/WASTE";  // URL of the target Web
$().SPServices.defaults.listName = excelList;  // Name of the list for list 

// Enable support of cross domain origin request
jQuery.support.cors = true;

// Disable caching of AJAX responses - Stop IE reusing cache data for the same requests
$.ajaxSetup({
    cache: false
});


$(document).ready(function () 
{

	  
	 refresh();
	

     $('#refreshimg').click(function()
	 {
		refresh();
		return false;
  });
  
	
  
  
});


function refresh()
{


		$("#refreshimg").attr('src',"images/loading.gif");
		
		var status=getEXCELData();

		if(status=="success")
		{
			var currentdate = new Date();
			var datetime = "";
			datetime += dateToString(currentdate );
			datetime += + " "+currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();
			$('#lastrefresh').html(datetime);
		}
		else
		{
			$('#lastrefresh').html("Error");
		
		}
		
		
        $("#refreshimg").attr('src',"images/refresh.png");
   
			


}


// --------------------------------------------------------------------
// Initialize the gadget.
// --------------------------------------------------------------------
function init() 
{
    // Enable Settings dialog for the gadget. 
    // System.Gadget.settingsUI = "cpsettings.html";

    // Specify the Flyout root.
	
	var IsGadget = (window.System != undefined);
		if(IsGadget)
		{
			 System.Gadget.Flyout.file = "flyout.html";
			 System.Gadget.Flyout.show = false;
  }
}


function  getEXCELData()	
{
			var myQuery = "<Query><Where><And><Or><Or><Eq><FieldRef Name='Project_x0020_Contact' /><Value Type='Integer'><UserID/></Value></Eq><Eq><FieldRef Name='Project_x0020_Director' /><Value Type='Integer'><UserID/></Value></Eq></Or><Eq><FieldRef Name='Project_x0020_VP' /><Value Type='Integer'><UserID/></Value></Eq></Or><Neq><FieldRef Name='Project_x0020_Status' /><Value Type='Text'>Canceled</Value></Neq></And></Where></Query>";
			// var myQuery = "<Query><Where><Eq><FieldRef Name='Project_x0020_Contact' /><Value Type='Integer'><UserID/></Value></Eq></Where></Query>";

			
			$().SPServices(
					{
						operation: "GetListItems",
						async: false,
						listName: excelList,
						CAMLViewFields: "<ViewFields Properties='True'><FieldRef Name='Title' /><FieldRef Name='Project_x0020_Status' /><FieldRef Name='Project_x0020_Director' /><FieldRef Name='Project_x0020_Contact' /><FieldRef Name='Project_x0020_VP' /><FieldRef Name='Estimated_x0020_Savings' /></ViewFields>",
						CAMLQuery: myQuery,
						completefunc: function (xData, Status) 
						{
							if (Status == "Error")
							{
							
								return "error";
							}
							// alert(Status);
							var resJson=$(xData.responseXML).SPFilterNode("z:row").SPXmlToJson(
							{ 
							
								  mapping: 
								  {
										 ows_ID: {mappedName: "ID", objectType: "Counter"},
										 ows_Title: {mappedName: "Title", objectType: "Text"},
										 ows_Created: {mappedName: "Created", objectType: "DateTime"}
								  },   
								   includeAllAttrs: true
							});
							
							
							
							// var wrapper={objects:resJson};
							
							// var template =  "{{objects}}<tr><td class='title'>{{Title}}</td><td class='amount'>$ {{Estimated_x0020_Savings | number | formatMoney  }}</td></tr>{{/objects}}";
							
							
						
							
							var statuslist=new Array();
							var sum=0;
							$.each(resJson, function(i,excel) 
							{
								//insert the departments
								if (excel.Project_x0020_Status != null && $('#' + excel.Project_x0020_Status.replace(/ /g,"_")).length == 0) 
								{
									// console.log(excel.Project_x0020_Status);
								  
									$('#accordion').append('<tbody id='+ excel.Project_x0020_Status.replace(/ /g,"_")+' class="category"><tr bgcolor=rgb(251,245,147) class="contentrow"><td class="arrow">> </td><td onclick="javascript:showFlyout('+excel.Project_x0020_Status.replace(/ /g,"_")+'sub)" class="content">'+excel.Project_x0020_Status+'</td><td class="amount">$ 4,000</td></tr></tbody><tbody class="subcategory" id='+excel.Project_x0020_Status.replace(/ /g,"_")+'sub></tbody>');
									
									statuslist.push(excel.Project_x0020_Status.replace(/ /g,"_"));
									
									
								}
								//insert contacts in the accordion
								// $('#' + excel.Project_x0020_Status.replace(/ /g,"_")).after('<table style="width:100%"><tr><td class="title"><a href="https://teams.aexp.com/sites/teamsitewendy/WASTE/Lists/WASTE%20Ideas/dispform.aspx?ID=' + excel.ID + '">' + excel.Title + '</a></td><td class="amount">$ '+ getMoney(excel.Estimated_x0020_Savings)   +'</td></tr></table>');
								$('#' + excel.Project_x0020_Status.replace(/ /g,"_") +'sub').append('<tr bgcolor="rgb(251,245,147)" class="idearow"><td class="idea" colspan="2"><a href="https://teams.aexp.com/sites/teamsitewendy/WASTE/Lists/WASTE%20Ideas/dispform.aspx?ID='+ excel.ID+'">'+excel.Title+'</a></td><td class="ideaamount">'+getMoney(excel.Estimated_x0020_Savings)+'</td></tr>');
								
								var previousSum=$('#' + excel.Project_x0020_Status.replace(/ /g,"_")).attr("sum");
								if (typeof(previousSum) == "undefined")
									previousSum=0;
									
								previousSum=Number(previousSum)+Number(excel.Estimated_x0020_Savings);
								$('#' + excel.Project_x0020_Status.replace(/ /g,"_")).attr("sum",previousSum);
								
							});
							
								/*$.each(statuslist, function(i,list) 
								{
								
									var sum=$("#" + list).attr("sum");
									
									sum= "$ "+ getMoney(sum);
									// $("#" + list).after("<span style='float:right'>"+sum+"</span>");
									
									$("#" + list).nextUntil("h3").wrapAll("<div></div>");
										
									$("#" + list).next().append('<table style="width:100%"><tr><td class="title"><b>Total</b></td><td class="amount">' + sum   +'</td></tr></table>');
									
									
									
									
								});*/
								
							}});
							
							
							
						
							
							
							return "success"
							
						
					   
							
					
					
}

// --------------------------------------------------------------------
// Display the Flyout 
// --------------------------------------------------------------------
function showFlyout(status) 
{
	ActiveFlyout=status
	var IsGadget = (window.System != undefined);
		if(IsGadget)
		{
 
		System.Gadget.Flyout.file = "flyout.html";
		System.Gadget.Flyout.onShow = FlyoutLoaded;
		System.Gadget.Flyout.show =!System.Gadget.Flyout.show;
		}

}


function FlyoutLoaded()
{
  //you can call System.Gadget.Flyout.document.getElementById(...) here
  
  /*var approvedDOM=$('approvedsub').html();
  var flyoutDOM=System.Gadget.Flyout.document.getElementById('faccordion');
  
  $(flyoutDOM).html(approvedDOM);*/
  
  var approvedDOM=$(ActiveFlyout).html();
  var flyoutDOM=System.Gadget.Flyout.document.getElementById('faccordion');
   
  $(flyoutDOM).append(approvedDOM);
  
}


function navCodeProject() {
    window.open("https://teams.aexp.com/sites/teamsitewendy/WASTE/SitePages/My%20WASTE%20Home.aspx");
}


function getMoney(number){
var n = number, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };

 
 function dateToString(date) {
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var dateOfString = (("" + day).length < 2 ? "0" : "") + day + "/";
    dateOfString += (("" + month).length < 2 ? "0" : "") + month + "/";
    dateOfString += date.getFullYear();
    return dateOfString;
}

