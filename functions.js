			var image_resize_w=32;
			var image_resize_h=32;
			var hist_bins = 128;
			var icon_w = 32;
			var icon_h = 32;
			//References: https://api.jquery.com/jquery.post/
			var server = "http://127.0.0.1:5000";
			var flask_path = "/KerasModelHist";
			var icons_folder = './Images/';
			var verbosity = false; // If true, then console.log several information

			var image_flatten = [];
			var image_dic = {'image':[0,1,2,3]};
			var test_dic = image_dic;
			$( function() {
				$( "#send_img_btn" ).click(function() {
					var send_msg = "<p>Sending image</p>";
					var received_msg = "<p>Result arrived</p>";
					var error_msg = "<p>There was an error, please try the <strong>Send test data to server</strong> or upload a valid image</p>";
					console.log(send_msg);
					var image_l = image_dic['image'].length;
					if (image_l > 5)
					{
						$('#message').html(send_msg);
						$.ajax({
	  						type: "POST",
  							url:server+flask_path,
  							data: JSON.stringify(image_dic),
  							dataType: 'json'
						}).done(function(data) { 
							if (verbosity==true)
							{
								console.log(data);	
							}
							var _res = JSON.stringify(data)
							$('#message').html(received_msg);
							var inference = data['inference']
							var categories = ['happy1.png','happy2.jpg','happy3.jpg','sad1.png','sad2.png','sad3.png'];
							var inference_html = "";
							$('#inference').html(inference_html);
							for (_=0;_<inference.length;_++)
							{
								var score = parseFloat(inference[_]);
								score = (Math.round(score*10000))/100;
								inference_html+='<img src="'+icons_folder+categories[_]+'" width="'+icon_w+'" height="'+icon_h+'" >'+score+'%<br/>'
							}
							$('#inference').html(inference_html);

						}).fail(function(){
							$('#message').html(error_msg);
						});
					}
					else
					{
						$('#message').html(error_msg);
					}
				});
				$( "#send_test_btn" ).click(function() {
					var send_msg = "<p>Sending test data</p>";
					var received_msg = "<p>Test data received</p>";
					var error_msg = "<p>There was an error, maybe the server is down </p>";
					console.log(send_msg);
					$('#message').html(send_msg);
					$.ajax({
  						type: "POST",
  						url:server+"/test",
  						data: JSON.stringify(test_dic),
  						dataType: 'json'
					}).done(function(datax) { 
						$('#message').html(received_msg+datax);
					}).fail(function(){
						$('#message').html(error_msg);
					});
				});
  			});

		function rgb_bright_hist(i_flatten_rgbi,bins=10,min=0,max=255)
		{
			//Where to store the histogram
			var hist = [];
			for (_=0;_<bins*4;_++)
			{
				hist.push(0);
			};

			var delta  = (max-min)/bins;
			var lims = [];
			for (_=min + delta;_<=max;_=_+delta)
			{
				lims.push(_+0.05);
			}
			
			for (i=0; i<i_flatten_rgbi.length;i=i+4)
			{
				_r=i_flatten_rgbi[i];
				_g=i_flatten_rgbi[i+1];
				_b=i_flatten_rgbi[i+2];
				// 0.21 R + 0.72 G + 0.07 B
				_gray = 0.21*_r+0.72*_g+0.07*_b;
				
				var _ri = val_index(_r,lims);
				var _gi = val_index(_g,lims);
				var _bi = val_index(_b,lims);
				var _grayi = val_index(_gray,lims);

				hist[_ri]+=1;
				hist[_gi+bins]+=1;
				hist[_bi+bins*2]+=1;
				hist[_grayi+bins*3]+=1;

			}
			return hist;

		}
		function val_index(val,list)
		{
			for (_=0;_<list.length;_++)
			{
				if (val < list[_])
				{
					var output = _;
					break;
				}
			}
			return output;
		}