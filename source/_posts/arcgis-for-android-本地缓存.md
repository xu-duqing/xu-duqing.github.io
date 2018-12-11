title: arcgis for android 本地缓存
tags:
  - Android
  - arcgis
date: 2013-08-1 22:27:23
---


最近做的arcgis for android项目中由于移动和电信网络实在太慢，加上流量消耗也厉害。想到谷歌和百度都使用了缓存的方法。即将浏览过的地图保存到SD卡中，下次浏览相同地块的时候就不需要在从网上下载直接调用本地即可。在API中找了一通没法发现有类似功能的接口，问esri的人也没有回复。算了继承TiledServiceLayer自己实现一个吧。
<!--more-->

因为初始化图层的时候需要设置TileInfo的值，而这个值直接影响到地图是否可以调用成功。我在这块费大了时间了找不到原因，其实就是TileInfo的数据设置的不对，应该和你发布地图的TileInfo信息一致。这些信息可以在服务的pjson中获得 如：“http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer?f=pjson”  我写了个json解析类获得这些需要的数据
<br/>

<!--lang:java-->

	public class ReturnJson {
	    private String strURL;
	    private int rows; // 瓦片高度
	    private int cols; // 瓦片宽度
	    private int dpi; // //瓦片分辨率
	    private Point origin; // 地图原点
	    private int wkid; // 地图坐标ID
	    private double[] res;        //地图分辨率
	    private double[] scale;   //比例尺
	    private Envelope InitEnvelope; // 初始化范围
	    private Envelope FullEnvelope; // 最大范围

	    public int getRows() {
	        return rows;
	    }

	    public int getCols() {
	        return cols;
	    }

	    public int getDpi() {
	        return dpi;
	    }

	    public Point getOrigin() {
	        return origin;
	    }

	    public int getWkid() {
	        return wkid;
	    }

	    public double[] getRes() {
	        return res;
	    }

	    public double[] getScale() {
	        return scale;
	    }

	    public Envelope getInitEnvelope() {
	        return InitEnvelope;
	    }

	    public Envelope getFullEnvelope() {
	        return FullEnvelope;
	    }

	    public ReturnJson(String strURL) {
	        // TODO Auto-generated constructor stub
	        this.strURL = strURL;
	        // String jsonString = loadAssetsString();
	        ExplainJson();
	    }

	    // 解析json中关键数据保存起来
	    public void ExplainJson() {
	        HttpPost request = new HttpPost(strURL);
	        try {
	            HttpResponse httpResponse = new DefaultHttpClient()
	                    .execute(request);
	            String retStr = EntityUtils.toString(httpResponse.getEntity());

	            JSONObject jsonObject_tileInfo = new JSONObject(retStr)
	                    .getJSONObject("tileInfo");
	            JSONObject jsonObject_initialExtent = new JSONObject(retStr)
	                    .getJSONObject("initialExtent");
	            JSONObject jsonObject_fullExtent = new JSONObject(retStr)
	                    .getJSONObject("fullExtent");
	            JSONArray jsonArray_lods = jsonObject_tileInfo.getJSONArray("lods");
	            JSONObject jsonObject_spatialReference = jsonObject_tileInfo
	                    .getJSONObject("spatialReference");
	            rows = jsonObject_tileInfo.getInt("rows");
	            cols = jsonObject_tileInfo.getInt("cols");
	            dpi = jsonObject_tileInfo.getInt("dpi");
	            wkid = jsonObject_spatialReference.getInt("wkid");
	            double x = jsonObject_tileInfo.getJSONObject("origin").getDouble(
	                    "x");
	            double y = jsonObject_tileInfo.getJSONObject("origin").getDouble(
	                    "y");
	            origin = new Point(x, y);
	            double xmin = jsonObject_initialExtent.getDouble("xmin");
	            double ymin = jsonObject_initialExtent.getDouble("ymin");
	            double xmax = jsonObject_initialExtent.getDouble("xmax");
	            double ymax = jsonObject_initialExtent.getDouble("ymax");
	            InitEnvelope = new Envelope(xmin, ymin, xmax, ymax);
	            xmin = jsonObject_fullExtent.getDouble("xmin");
	            ymin = jsonObject_fullExtent.getDouble("ymin");
	            xmax = jsonObject_fullExtent.getDouble("xmax");
	            ymax = jsonObject_fullExtent.getDouble("ymax");
	            FullEnvelope = new Envelope(xmin, ymin, xmax, ymax);

	            int k = jsonArray_lods.length();
	            res = new double[k];
	            scale = new double[k];
	            for (int i = 0; i < jsonArray_lods.length(); i++) {

	                JSONObject jsonObject3 = (JSONObject) jsonArray_lods.opt(i);
	                res[i] = jsonObject3.getDouble("resolution");
	                scale[i] = jsonObject3.getDouble("scale");

	            }

	        } catch (Exception e) {
	            // TODO: handle exception
	        }

	    }

	}

>然后要做的是继承TiledServiceLayer初始化图层；

<!--lang:java-->

	//初始化图层设置Tileinfo数据
    protected void initLayer() {
        if (getID() == 0) {
            this.nativeHandle = create();
        }
        try {
            SpatialReference localSpatialReference = SpatialReference
                    .create(json.getWkid());
            setDefaultSpatialReference(localSpatialReference);
            Envelope FullEnvelope = json.getFullEnvelope();
            Envelope initEnvelope = json.getInitEnvelope();
            setFullExtent(FullEnvelope);
            setInitialExtent(initEnvelope);

            Point localPoint = json.getOrigin();
            double[] arrayOfDoublescale = json.getScale();
            double[] arrayOfDoubleres = json.getRes();
            int cols = json.getCols();
            int dpi = json.getDpi();
            int rows = json.getRows();
            int k = arrayOfDoublescale.length;
            TiledServiceLayer.TileInfo localTileInfo = new TiledServiceLayer.TileInfo(
                    localPoint, arrayOfDoublescale, arrayOfDoubleres, k, dpi,
                    rows, cols);
            setTileInfo(localTileInfo);
            super.initLayer();
            return;
        } catch (Exception localException) {
            localException.printStackTrace();
        }

    }


>重写getTile()  ，我在这里花了好长时间就是因为怎么都进不去，最后发现触发这个方法的条件是当前显示范围下有地图图块如果你没有移动到有地图的地方或者tileinfo本身就写错了那就不可能进来了

<!--lang:java-->

	//获取瓦片  如果这方法总是进不去，别想。肯定是图层初始化TileInfo数据添加的不对
    @Override
    protected byte[] getTile(int level, int col, int row) throws Exception {
        // TODO Auto-generated method stub
        byte[] bytes = null;
        //根据图层、行、列找本地数据
        bytes = getOfflineCacheFile(level, col, row);
        //如果本地数据为空，则调用网络数据。改接口2.0.0测试成功。最新的10.0貌似没有这个接口。具体自个找找吧，我也没有测过
        if (bytes == null) {
            String strUrl = layerURL + "/tile" + "/" + level + "/" + row + "/"
                    + col;
            HashMap<String, String> localHashMap = new HashMap<String, String>();
            bytes = com.esri.core.internal.b.a.a.a(strUrl, localHashMap);
            AddOfflineCacheFile(level, col, row, bytes);
        }
        return bytes;
    }

>接下来就是对网络图片的保存和读取了

<!--lang:java-->

	// 将图片保存到本地 目录结构可以随便定义 只要你找得到对应的图片
    private byte[] AddOfflineCacheFile(int level, int col, int row, byte[] bytes) {

        File file = new File(cachepath);
        if (!file.exists()) {
            file.mkdirs();
        }
        File levelfile = new File(cachepath + "/" + level);
        if (!levelfile.exists()) {
            levelfile.mkdirs();
        }
        File colfile = new File(cachepath + "/" + level + "/" + col);
        if (!colfile.exists()) {
            colfile.mkdirs();
        }
        File rowfile = new File(cachepath + "/" + level + "/" + col + "/" + row
                + ".dat");
        if (!rowfile.exists()) {
            try {
                FileOutputStream out = new FileOutputStream(rowfile);
                out.write(bytes);
            } catch (Exception e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
        return bytes;

    }

    // 从本地获取图片
    private byte[] getOfflineCacheFile(int level, int col, int row) {
        byte[] bytes = null;
        File rowfile = new File(cachepath + "/" + level + "/" + col + "/" + row
                + ".dat");

        if (rowfile.exists()) {
            try {
                bytes = CopySdcardbytes(rowfile);
            } catch (IOException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        } else {
            bytes = null;
        }
        return bytes;
    }

    // 读取本地图片流
    public byte[] CopySdcardbytes(File file) throws IOException {
        FileInputStream in = new FileInputStream(file);

        ByteArrayOutputStream out = new ByteArrayOutputStream(1024);

        byte[] temp = new byte[1024];

        int size = 0;

        while ((size = in.read(temp)) != -1) {
            out.write(temp, 0, size);
        }
        in.close();
        byte[] bytes = out.toByteArray();
        return bytes;
    }

>需要值得注意的是如果地图服务是动态出图那么就不能加载。需要源码的可以留Email

