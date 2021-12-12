<template>
	<view class="cardList">
		<view v-for="(item,i) in list" class="cardListBody" :style="{'width':100/list.length+'%'}">
			<view class="cardList-card">
				<view class="cardList-carditem" :style="{'background':item.container.background}">
					<navigator :url="item.nav" class="cardList-allitem">
						<view :class="'cardlist cardlist-'+item.svg" v-if="item.svg!==undefined">
						</view>
						<image class="cardlist" :url="item.img" v-if="item.svg===undefined&&item.img!=undefined"></image>
						<view class="cardList-title">
							{{item.title}}
						</view>
					</navigator>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"cardList",
		data() {
			return {
				
			};
		},
		props:{
			list:{
			}
		},
		methods:{
			test(){
				// console.log(this.list)
			}
		}
	}
</script>

<style lang="less">
	// 字体文件
	@font-face {
  font-family: "cardlist"; /* Project id 2618527 */
  /* Color fonts */
  src:
		url('//at.alicdn.com/t/font_2618527_8yey2ut8jbp.woff2?t=1624184132479') format('woff2'),
		url('//at.alicdn.com/t/font_2618527_8yey2ut8jbp.woff?t=1624184132479') format('woff'),
		url('//at.alicdn.com/t/font_2618527_8yey2ut8jbp.ttf?t=1624184132479') format('truetype'),
		url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAS8AAwAAAAACQgAAARuAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIlYjGgZgAGQKiiCIDwE2AiQDJgskAAQgBYF8ByAb/gbIHjIsUZQtAVUS+y/cS3UuwcP//qj7MDaaGfn+nEk/TYS2bqJCA9u2dXPiz7/3eoKaumk95a0A8jbnlvwaIMS+v7U7E73XdXqCt2lg4de+BhgHUn6KN3FN/ptGAZfwgGbYRVFYFTga8MCigooGtPF8YnugFyb45JqAI+AJ5CKDBAQKpAJtowQOgKOtxglnBK4LLoAr4Aa4I/FA4AmAl8EbgBk8taoG/rs5gLALBVqDOAAHtBwnpwHoiFsR0+Am3EAC4c06nV2JEXAQjD/OUJxggDIQzkIASOQTgGgKHHbl+O9Pjm1pugG8XSkFs7+jfq8/7Hnd84HnM4JQmyI8qoTqq86XkMMhm0IumQmY40P9YwFCAHEISP/WLH32aAbJKJY4S6e3c4qJuqIiTatFKXp7QnVLI53HXQ0eA7Pxll125zdfyy7X0eCg2Kc3E9YRrxto5WaxnlwIx5/aBEb9zZthYsMNwlxHozuHWRmKbdpX6aL+bdeAW1u/eeNmT1iNC2vLJ2ebRggh1pw+YhOR7TpEBnetW3sjiR2Si0TNuCSCayOtQnREwmx0mxlSCTzt1VTpvkyG93TGJx35ZVCKhBJeBTWW1SIlreZSMOgpbgEGbUbFk995nhs3x2XtwZWObwuX399pbTh0UHar/Ze4BTuITcXBlTBj6jWyhtb4jA/QQbxfXMHsFVd+P0W6Pr8X2uzTDTwGMyju/DCtCR3DQ9hc5M5flTVSimn/NRt4DYV4tdgrgVkleFCjgr0pDqoVF0wDpS+vuI+vB1r0urJ3cV5PGsFf5IRa1Zv8MYz5mhStVfmvslPJZnlHkQcK7qVjur7GJCx2p6+6v6JiIGCApMkLly1a3tY9sMdr+qZaW9hlMOaRlTwc5vRpS2hGsG8OEDRvuRfkejWTkUt9a+z1O4IcI8dRrvGb+6kqxl+TYowgKLvmjDepsNizYCBzNyrNv3uxtCegN607YLE0oLsvNaBnsbTbvy+qw9HHw3PUQyonLLk2VrswyLk6NMTHYZhq55BQDWJcqmMinoRQtQvIP1yc5Zko16sMNbJr8cWfmHw+I4qdQmL+Gesi2YUaecYqIhU4ubdn2mGwDwaAmDtZGbEJdk4iU1OR6sEAkeL6l3PHIwLehfobqt6PAPcdYnPKt9+msW8/BptkyBxq9rJLc3RySEhwcPrgZwhu2RXhn3w9FL/41n/0i3zwHjXTAq09FofrB2QUeKWFvOs8/bG+U9/dv7q5C+5+Nsp9dH+EY+7jltp9fE87dcu3UcVbpVFVZVEEXnSd69NQ7OZ2+h2n+D3qpqefGVHy/yWtHn/T20/3P8cD/3MOygA4ImdQXzHqyPqaV4YyhtLjVA0wQxols2Jd+TkInmPxYRycTxKXQh3phEJombeZmrOkwfNGtKIQQ7QmmnS0A6HUXutINN0wwXSqmUUpRdRQSyoss6mjtM3ggiPOrs6PRJJ8VkQad3w+BzluHz5jBIJl1UiICsqjdkhpVQmF0/D/FvwsFAQA') format('woff2');
	}
	.cardlist {
	  font-family: "cardlist" !important;
		width: 16px;
	  font-size: 16px;
	  font-style: normal;
	  -webkit-font-smoothing: antialiased;
	  -moz-osx-font-smoothing: grayscale;
		&::before{
			margin-right: -100px;
			float: left;
			color: #999999;
		}
	}
	
	.cardlist-record:before {
	  content: "\e667";
	}
	
	.cardlist-map:before {
	  content: "\e643";
	}
	
	.cardlist-search:before {
	  content: "\e60f";
	}
	
	.cardlist-data:before {
	  content: "\e603";
	}
	
	.cardlist-transform:before {
	  content: "\e61b";
	}
	
	.cardlist-book:before {
	  content: "\e655";
	}
	
	

	.cardList-carditem{
		margin: 5px;
		background-color: white;
		border-radius: 5px;
	}
	.cardList{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}
	.cardListBody{
		min-width: 33%;
	}
	.cardList-card{
		flex: 1;
		width: 100%;
	}
	.cardList-allitem{
		margin: 0 auto;
		padding: 20px 10px;
	}
	.cardList-title{
		font-size: 12px;
		color: #505050;
		text-align: center;
		margin-left: 20px;
	}
</style>
