/* 
* @Author: ocean
* @Date:   2015-07-12 22:12:51
* @Last Modified by:   ocean
* @Last Modified time: 2015-07-12 22:31:05
*/

'use strict';

$(function(){
	$('.del').click(function(e){
		var target = $(e.target);
		var id = target.data('id');
		var tr = $('.item-id-' + id);

		$.ajax({
			type: 'DELETE',
			url: '/admin/list?id=' + id
		}).done(function(results){
			if(results.success === 1){
				if(tr.length > 0){
					tr.remove();
				}
			}
		})
	});
})