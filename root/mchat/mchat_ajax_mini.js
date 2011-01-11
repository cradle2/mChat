/**
*
* @package mChat JavaScript Code mini
* @version 1.4.2 of 2011-01-10
* @copyright (c) 2010 By Rich McGirr (RMcGirr83) http://rmcgirr83.org
* @copyright (c) 2009 By Shapoval Andrey Vladimirovich (AllCity) ~ http://allcity.net.ru/
* @license http://opensource.org/licenses/gpl-license.php GNU Public License
*
**/

//var $jQ=jQuery;

jQuery(document).ready(function(){if(!mChatArchiveMode){var scrH=$('#mChatmain')[0].scrollHeight;$('#mChatmain').animate({scrollTop:scrH},1000,'swing');if(mChatPause){$('#mChatMessage').bind('keypress',function(){clearInterval(interval);$('#mChatLoadIMG,#mChatOkIMG,#mChatErrorIMG').hide();$('#mChatRefreshText').html(mChatRefreshNo).addClass('mchat-alert');$('#mChatPauseIMG').show()})}$.fn.preventDoubleSubmit=function(){var alreadySubmitted=false;return jQuery(this).submit(function(){if(alreadySubmitted){return false}else{alreadySubmitted=true}})};$.fn.autoGrowInput=function(o){var width=$('.mChatPanel').width();o=$.extend({maxWidth:width-20,minWidth:0,comfortZone:20},o);this.filter('input:text').each(function(){var minWidth=o.minWidth||$(this).width(),val='',input=$(this),testSubject=$('<tester/>').css({position:'absolute',top:-9999,left:-9999,width:'auto',fontSize:input.css('fontSize'),fontFamily:input.css('fontFamily'),fontWeight:input.css('fontWeight'),letterSpacing:input.css('letterSpacing'),whiteSpace:'nowrap'}),check=function(){if(val===(val=input.val())){return}var escaped=val.replace(/&/g,'&amp;').replace(/\s/g,' ').replace(/</g,'&lt;').replace(/>/g,'&gt;');testSubject.html(escaped);var testerWidth=testSubject.width(),newWidth=(testerWidth+o.comfortZone)>=minWidth?testerWidth+o.comfortZone:minWidth,currentWidth=input.width(),isValidWidthChange=(newWidth<currentWidth&&newWidth>=minWidth)||(newWidth>minWidth&&newWidth<o.maxWidth);if(isValidWidthChange){input.width(newWidth)}};testSubject.insertAfter(input);$(this).bind('keypress blur change submit focus update',check)});return this};$('input.mChatText').autoGrowInput();$('#postform').preventDoubleSubmit();if(mChatSound&&$.cookie('mChatNoSound')!='yes'){$.cookie('mChatNoSound',null);$('#mChatUseSound').attr('checked','checked')}else{$.cookie('mChatNoSound','yes');$('#mChatUseSound').removeAttr('checked')}if($('#mChatUserList').length&&($.cookie('mChatShowUserList')=='yes'||mChatCustomPage)){$('#mChatUserList').show()}}});var mChat={countDown:function(){if($('#mChatSessMess').hasClass('mchat-alert')){$('#mChatSessMess').removeClass('mchat-alert')}session_time=session_time-1;var sec=Math.floor(session_time);var min=Math.floor(sec/60);var hrs=Math.floor(min/60);sec=(sec%60);if(sec<=9){sec="0"+sec}min=(min%60);if(min<=9){min="0"+min}hrs=(hrs%60);if(hrs<=9){hrs="0"+hrs}var time_left=hrs+":"+min+":"+sec;$('#mChatSessMess').html(mChatSessEnds+' '+time_left);if(session_time<=0){clearInterval(counter);$('#mChatSessMess').html(mChatSessOut).addClass('mchat-alert')}},clear:function(){if($('#mChatMessage').val()==''){return false}var answer=confirm(mChatReset);if(answer){if($('#mChatRefreshText').hasClass('mchat-alert')){$('#mChatRefreshText').removeClass('mchat-alert')}if(mChatPause){interval=setInterval(function(){mChat.refresh()},mChatRefresh)}$('#mChatOkIMG').show();$('#mChatLoadIMG, #mChatErrorIMG, #mChatPauseIMG').hide();$('#mChatRefreshText').html(mChatRefreshYes);$('#mChatMessage').val('').focus()}else{$('#mChatMessage').focus()}},sound:function(file){if($.cookie('mChatNoSound')=='yes'){return}if($.browser.msie){$('#mChatSound').html('<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0" height="0" width="0" type="application/x-shockwave-flash"><param name="movie" value="'+file+'"></object>')}else{$('#mChatSound').html('<embed src="'+file+'" width="0" height="0" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash"></embed>')}},toggle:function(id){$('#mChat'+id).slideToggle('normal',function(){if($('#mChat'+id).is(':visible')){$.cookie('mChatShow'+id,'yes')}if($('#mChat'+id).is(':hidden')){$.cookie('mChatShow'+id,null)}})},add:function(){if($('#mChatMessage').val()==''){return false}var mChatMessChars=$('#mChatMessage').val().replace(/ /g,'');if(mChatMessChars.length>mChatMssgLngth&&mChatMssgLngth){alert(mChatMssgLngthLong);return}$.ajax({url:mChatFile,timeout:10000,type:'POST',data:$('#postform').serialize(),dataType:'text',beforeSend:function(){$('#submit_button').attr('disabled','disabled');$('#mChatMessage').val('');if(mChatUserTimeout){clearInterval(activeinterval);clearInterval(counter)}clearInterval(interval)},success:function(){mChat.refresh()},error:function(XMLHttpRequest){if(XMLHttpRequest.status==400){alert(mChatFlood)}else if(XMLHttpRequest.status==403){alert(mChatNoAccess)}else if(XMLHttpRequest.status==501){alert(mChatNoMessageInput)}},complete:function(){if($('#mChatData').children('#mChatNoMessage :last')){$('#mChatNoMessage').remove()}$('#submit_button').attr('disabled','');interval=setInterval(function(){mChat.refresh()},mChatRefresh);if(mChatUserTimeout){session_time=mChatUserTimeout?mChatUserTimeout/1000:false;counter=setInterval(function(){mChat.countDown()},1000);activeinterval=setInterval(function(){mChat.active()},mChatUserTimeout)}}})},edit:function(id){var message=$('#edit'+id).val();var data=prompt(mChatEditInfo,message);if(data){$.ajax({url:mChatFile,timeout:10000,type:'POST',data:{mode:'edit',message_id:id,message:data},dataType:'text',beforeSend:function(){clearInterval(interval);if(mChatUserTimeout){clearInterval(activeinterval);clearInterval(counter);$('#mChatSessTimer').html(mChatRefreshing)}},success:function(html){$('#mess'+id).fadeOut('slow',function(){$(this).replaceWith(html);$('#mess'+id).css('display','none').fadeIn('slow')})},error:function(XMLHttpRequest){if(XMLHttpRequest.status==403){alert(mChatNoAccess)}else if(XMLHttpRequest.status==501){alert(mChatNoMessageInput)}},complete:function(){interval=setInterval(function(){mChat.refresh()},mChatRefresh);if(mChatUserTimeout){session_time=mChatUserTimeout?mChatUserTimeout/1000:false;counter=setInterval(function(){mChat.countDown()},1000);activeinterval=setInterval(function(){mChat.active()},mChatUserTimeout)}scrH=$('#mChatmain')[0].scrollHeight;window.setTimeout(function(){$('#mChatmain').animate({scrollTop:scrH},1000,'swing')},1500)}})}},del:function(id){if(confirm(mChatDelConfirm)){$.ajax({url:mChatFile,timeout:10000,type:'POST',data:{mode:'delete',message_id:id},beforeSend:function(){clearInterval(interval);if(mChatUserTimeout){clearInterval(activeinterval);clearInterval(counter);$('#mChatSessTimer').html(mChatRefreshing)}},success:function(){$('#mess'+id).fadeOut('slow',function(){$(this).remove()});mChat.sound(mChatForumRoot+'mchat/del.swf')},error:function(){alert(mChatNoAccess)},complete:function(){interval=setInterval(function(){mChat.refresh()},mChatRefresh);if(mChatUserTimeout){session_time=mChatUserTimeout?mChatUserTimeout/1000:false;counter=setInterval(function(){mChat.countDown()},1000);activeinterval=setInterval(function(){mChat.active()},mChatUserTimeout)}}})}},refresh:function(){if(mChatArchiveMode){return}var mess_id=0;if($('#mChatData').children().not('#mChatNoMessage').length){if($('#mChatNoMessage')){$('#mChatNoMessage').remove()}mess_id=$('#mChatData').children(':last-child').attr('id').replace('mess','')}var oldScrH=$('#mChatmain')[0].scrollHeight;$.ajax({url:mChatFile,timeout:10000,type:'POST',data:{mode:'read',message_last_id:mess_id},dataType:'html',beforeSend:function(){$('#mChatOkIMG,#mChatErrorIMG,#mChatPauseIMG').hide();$('#mChatLoadIMG').show()},success:function(html){if(html!=''&&html!=0){if($('#mChatRefreshText').hasClass('mchat-alert')){$('#mChatRefreshText').removeClass('mchat-alert')}$('#mChatData').append(html).children(':last').not('#mChatNoMessage');var newInner=$('#mChatData').children().not('#mChatNoMessage').innerHeight();var newH=oldScrH+newInner;$('#mChatmain').animate({scrollTop:newH},'slow');mChat.sound(mChatForumRoot+'mchat/add.swf')}setTimeout(function(){$('#mChatLoadIMG,#mChatErrorIMG,#mChatPauseIMG').hide();$('#mChatOkIMG').show();$('#mChatRefreshText').html(mChatRefreshYes)},500)},error:function(){$('#mChatLoadIMG,#mChatOkIMG,#mChatPauseIMG,#mChatRefreshTextNo,#mChatPauseIMG,').hide();$('#mChatErrorIMG').show();mChat.sound(mChatForumRoot+'mchat/error.swf')},complete:function(){if(!$('#mChatData').children(':last').length){$('#mChatData').append('<div id="mChatNoMessage">'+mChatNoMessage+'</div>').show('slow')}}})},stats:function(){if(!mChatWhois){return}$.ajax({url:mChatFile,timeout:10000,type:'POST',data:{mode:'stats'},dataType:'html',beforeSend:function(){if(mChatCustomPage){$('#mChatRefreshN').show();$('#mChatRefresh').hide()}},success:function(stats){$('#mChatStats').replaceWith(stats);if(mChatCustomPage){setTimeout(function(){$('#mChatRefreshN').hide();$('#mChatRefresh').show()},500)}},error:function(){mChat.sound(mChatForumRoot+'mchat/error.swf')},complete:function(){if($('#mChatUserList').length&&($.cookie('mChatShowUserList')=='yes'||mChatCustomPage)){$('#mChatUserList').css('display','block')}}})},active:function(){if(mChatArchiveMode||!mChatUserTimeout){return}clearInterval(interval);$('#mChatLoadIMG,#mChatOkIMG,#mChatErrorIMG').hide();$('#mChatPauseIMG').show();$('#mChatRefreshText').html(mChatRefreshNo).addClass('mchat-alert');$('#mChatSessMess').html(mChatSessOut).addClass('mchat-alert')}};var interval=setInterval(function(){mChat.refresh()},mChatRefresh);var statsinterval=setInterval(function(){mChat.stats()},mChatWhoisRefresh);var activeinterval=setInterval(function(){mChat.active()},mChatUserTimeout);var session_time=mChatUserTimeout?mChatUserTimeout/1000:false;if(mChatUserTimeout){var counter=setInterval(function(){mChat.countDown()},1000)}if($.cookie('mChatShowSmiles')=='yes'&&$('#mChatSmiles').css('display','none')){$('#mChatSmiles').slideToggle('slow')}if($.cookie('mChatShowBBCodes')=='yes'&&$('#mChatBBCodes').css('display','none')){$('#mChatBBCodes').slideToggle('slow')}if($.cookie('mChatShowUserList')=='yes'&&$('#mChatUserList').length){$('#mChatUserList').slideToggle('slow')}if($.cookie('mChatShowColour')=='yes'&&$('#mChatColour').css('display','none')){$('#mChatColour').slideToggle('slow')}$('#mChatUseSound').change(function(){if($(this).is(':checked')){$.cookie('mChatNoSound',null)}else{$.cookie('mChatNoSound','yes')}});