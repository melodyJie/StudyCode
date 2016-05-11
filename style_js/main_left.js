$(function(){
	//右侧的隐藏与显示
	$('#left_bottom li').on('click',function(){
		$this=$(this);
		$name=$this.attr('name');
		$("#main_right div[title='box']").attr('class','hidden');
		$("#"+$name).attr('class','');
	})
})