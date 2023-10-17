// index.js
// 获取应用实例
const app = getApp()
var CTEngine = require('./CTEngine-js/engine.js')

require('./CTEngine-js/gltumble.min.js')
require('./CTEngine-js/gl-matrix-min.js')
//path
const envPath = 'http://10.2.97.220/web-2.0/samples/default_env';
const env = 'default_env';
const assetsPath = `http://10.2.97.220/web-2.0/samples/Dz/assets`
const modelsPath = `${assetsPath}/models`;
const dataPath = `${assetsPath}/data`
const ibl_url = `${envPath}/${env}_ibl.ktx`;
const sky_url = `${envPath}/${env}_skybox.ktx`;

let DZ_url = `http://10.2.97.220/web-2.0/samples/Dz/assets/models/Dz/Dz.glb`;
let dancing_url= `${modelsPath}/zhaoyun/zhaoyun.glb`

// data
const blink_dat = `${dataPath}/blink.dat`
const phone_to_bs_mean_1_txt = `${dataPath}/phone_to_bs_mean_1.dat`
const settingJson = `${dataPath}/settings.json`
const default_settingJson = `${dataPath}/default_settings.json`
const imageMaterial = `http://10.2.97.220/web-2.0/samples/materials/image.filamat`
const image1 = `${modelsPath}/Dz/1.png`
const image2 = `${modelsPath}/Dz/2.png`
const image3 = `${modelsPath}/Dz/3.png`
const image4 = `${modelsPath}/Dz/4.png`
let isSuccessTTS = false
let isRefresh = false
let actionIndex = 0
let lastFrameTime = 0.0
Page({
  data: {
    actionArray: [],
    actionIndex: 0,
    modelArray: [
      "Dz",
      "zhaoyun"
    ],
    modelIndex: 0,
    input: "",
    backArray: [
      "常规背景",
      "国庆背景",
      "中秋背景",
      "青春背景"
    ],
    backIndex: 0,
    voiceArray: [
      "yixiaoling",
      "yixiaoluo",
      "yixiaochao",
      "yixiaoxuan",
      "yixiaoke",
      "yixiaotong"
    ],
    voiceIndex: 0,
  },
  bindAction: function(e) {
    console.log("选择动作", this.data.actionArray[e.detail.value])
    this.setData({
      actionIndex: e.detail.value
    })
  },
  bindVoice: function(e) {
    console.log("选择音色", this.data.voiceArray[e.detail.value]);
    this.setData({
      voiceIndex: e.detail.value
    })
  },
  bindBackground: function(e) {
    console.log("选择背景", this.data.backArray[e.detail.value]);
    this.setData({
      backIndex: e.detail.value
    })
  },
  bindModel: function(e) {
    console.log("选择模型", this.data.modelArray[e.detail.value])
    this.setData({
      modelIndex: e.detail.value
    })
  },
  changeBackground: function() {
    const i = Number(this.data.backIndex) + 1;
    getApp().globalData.app.CTScene.addBackground();
    getApp().globalData.app.pngname = i + ".png";
    getApp().globalData.app.CTScene.setTexture(getApp().globalData.app.pngname);
    getApp().globalData.app.CTScene.showBackground([1.0,1.0,1.0]);
  },
  changeVoice: function() {
    const voice = this.data.voiceArray[this.data.voiceIndex];
    console.log(voice)
    getApp().globalData.app.avatar.setVoice(voice);
  },
  sendText: function() {
    // test streaming tts
    if(!this.data.input){return;}
    if(this.data.input!=""){
      const value = this.data.input;
      getApp().globalData.app.avatar.StartPlayStreamingTTS(value, "szr.ai.chinatelecom.cn", 8094, "tts/v1/streaming", 8000, 1, true);
    }
  },
  changeAction: function() {
    actionIndex = this.data.actionIndex;
  },
  changeModel:function() {
    const mesh = this.data.modelArray[this.data.modelIndex];
    actionIndex = 0;
    let mesh_url = `${modelsPath}/${mesh}/${mesh}.glb`;
    isRefresh = false;
    CTEngine.fetch([mesh_url], () => {
      console.log(getApp().globalData.app)
        getApp().globalData.app.refresh(mesh_url);
        const tcm = getApp().globalData.app.engine.getTransformManager();
        const inst = tcm.getInstance(getApp().globalData.app.assetRoot);
        inst.delete();
        getApp().globalData.app.canvas.requestAnimationFrame(getApp().globalData.app.render);
    })
  },
  getInputValue(e){
    this.data.input = e.detail.value;
  },
  loadJson:function(){
    getApp().globalData.app.FileLoader.loadSettings("settings.json",getApp().globalData.app.simpleViewer)
    //loadsetting
    CTEngine.applySettings(getApp().globalData.app.engine, getApp().globalData.app.simpleViewer, getApp().globalData.app.camera, getApp().globalData.app.skybox, getApp().globalData.app.renderer)
    CTEngine.applySettings(getApp().globalData.app.engine, getApp().globalData.app.simpleViewer, getApp().globalData.app.view)
    CTEngine.applySettings(getApp().globalData.app.engine, getApp().globalData.app.simpleViewer, getApp().globalData.app.ibl, getApp().globalData.app.sunlight, 
    getApp().globalData.app.engine.getLightManager(), getApp().globalData.app.scene, getApp().globalData.app.view)
  },
  onReady() {
    var data = this.data;
    var that = this;
    var gltfio = CTEngine.gltfio;
    var Fov = CTEngine.Camera$Fov;
    var LightType = CTEngine.LightManager$Type;
    var IndirectLight = CTEngine.IndirectLight;

    const query = wx.createSelectorQuery()
    //获取设备像素比
    const getPixelRatio = () => {
      let pixelRatio = 0
      wx.getSystemInfo({
        success: function (res) {
          pixelRatio = res.pixelRatio
        },
        fail: function () {
          pixelRatio = 0
        }
      })
      return pixelRatio
    }
    
    query.select('#myCanvas').node().exec((res) => {
      const canvas = res[0].node
      const dpr = wx.getSystemInfoSync().pixelRatio
      canvas.width = canvas.width * dpr
	    canvas.height = canvas.height * dpr

      class App {
        constructor(canvas) {
            this.canvas = canvas;
            
            const engine = this.engine = CTEngine.Engine.create(this.canvas);
            const scene = this.scene = engine.createScene()
    
            this.mesh = CTEngine.EntityManager.get().create();
    
            const indirectLight = this.ibl = engine.createIblFromKtx1(ibl_url);
            this.scene.setIndirectLight(indirectLight);
    
            const iblDirection = CTEngine.IndirectLight.getDirectionEstimate(indirectLight.shfloats);
            const iblColor = CTEngine.IndirectLight.getColorEstimate(indirectLight.shfloats, iblDirection);
            const iblIntensity = 20000;
            indirectLight.setIntensity(iblIntensity);
    
            // const skybox = engine.createSkyFromKtx1(sky_url);
            // this.scene.setSkybox(skybox);
            const skybox = this.skybox = CTEngine.Skybox.Builder().build(engine);
            const sunlight = this.sunlight = CTEngine.EntityManager.get().create();
            CTEngine.LightManager.Builder(CTEngine.LightManager$Type.SUN)
                .color(iblColor.slice(0, 3))
                .intensity(iblColor[3] * iblIntensity)
                .direction(iblDirection)
                .sunAngularRadius(1.9)
                .castShadows(true)
                .sunHaloSize(10.0)
                .sunHaloFalloff(80.0)
                .build(engine, sunlight);
            this.scene.addEntity(sunlight);
    
            const loader = this.loader = engine.createAssetLoader();
            
            this.allowRefresh = false;
            const asset = this.asset = this.loader.createAsset(DZ_url);
            this.assetRoot = this.asset.getRoot();
    
            // Crudely indicate progress by printing the URI of each resource as it is loaded.
            const onFetched = (uri) => {};
    
            const onDone = () => {
                this.allowRefresh = true;
                this.animator = this.asset.getInstance().getAnimator();
                this.getAction();
                this.animationStartTime = Date.now();
                // Clear the progress indication messages.
                //messages.innerText = "";
                this.asset.releaseSourceData();
            };
            this.asset.loadResources(onDone, onFetched, DZ_url);
    
            const cameraEntity = CTEngine.EntityManager.get().create();
            this.camera = engine.createCamera(cameraEntity);
            
            // avatar
            this.FileLoader = this.asset.getInstance().getFileLoader();    	
            console.log("create Avatar");
            this.asset.getInstance().createAvatar(engine, asset);
            this.avatar = this.asset.getInstance().getAvatar();
            
            // 这里将在cpp里读文件的操作时使用的数据写入文件中，保证逻辑的统一
            let testFiles = [phone_to_bs_mean_1_txt, blink_dat, settingJson, default_settingJson, 
              image1, image2, image3, image4]
            let writeFiles = ["phone_to_bs_mean_1.txt", "blink.dat", "settings.json", "default_settings.json",
          "1.png", "2.png", "3.png", "4.png"]
          for(var i=0; i<testFiles.length; ++i) {
                let buffer = CTEngine.assets[testFiles[i]]
                let bufferDescriptor = CTEngine.Buffer(buffer)
              this.avatar.writeFile(bufferDescriptor, writeFiles[i]);
                bufferDescriptor.delete()
            }    
    
            // 这里写完文件就可以释放掉了，不需要常驻内存管理
            let eraseTestFiles = [settingJson, default_settingJson]
            eraseTestFiles.forEach(name => {
                CTEngine.assets[name] = null
            })
            
            // 仿照cpp的调用逻辑
            this.avatar.Init("phone_to_bs_mean_1.txt", "blink.dat")
            
            const colorGrading = CTEngine.ColorGrading.Builder()
                .toneMapping(CTEngine.ColorGrading$ToneMapping.ACES_LEGACY)
                .build(engine);
    
            this.swapChain = engine.createSwapChain();
            this.renderer = engine.createRenderer();
            this.view = engine.createView();
            this.view.setCamera(this.camera);
            this.view.setScene(this.scene);
            this.view.setColorGrading(colorGrading);
            this.view.setSampleCount(4);
            this.resize();
            this.simpleViewer = new CTEngine.ViewerGui(this.engine, this.scene, this.view, 410);
            const imageMat = engine.createMaterial(imageMaterial);
            this.CTScene = new CTEngine.CTScene(this.engine, this.view, this.scene, imageMat);
            this.CTScene.addBackground();
            this.pngname = "1.png"
            this.CTScene.setTexture(this.pngname)
            this.CTScene.showBackground([1.0,1.0,1.0])
            this.render = this.render.bind(this);
            this.resize = this.resize.bind(this);
            this.refresh = this.refresh.bind(this);
            this.FileLoader.loadSettings("default_settings.json",this.simpleViewer)
            // loadsetting
            CTEngine.applySettings(engine, this.simpleViewer, this.camera, skybox, this.renderer)
            CTEngine.applySettings(engine, this.simpleViewer, this.view)
            CTEngine.applySettings(engine, this.simpleViewer, this.ibl, sunlight,
            engine.getLightManager(), this.scene, this.view)
            CTEngine.applyColorGrading(engine, this.simpleViewer, this.view);
            //window.addEventListener('resize', this.resize);
            this.mouseX = -1;
            this.mouseY = -1;
            this.mouseWheelY = 0;

            canvas.requestAnimationFrame(this.render);
        }
        
        // Test for memory leaks by destroying and recreating the asset.
        refresh(url) {
            if (!this.allowRefresh) {
                console.warn('Refresh not allowed while the model is still loading.');
                return;
            }
            console.info('Refreshing...');
            this.allowRefresh = false;
            this.scene.removeEntities(this.asset.getEntities());
            this.loader.destroyAsset(this.asset);
            this.animator = null
            this.asset = this.loader.createAsset(url);
            this.assetRoot = this.asset.getRoot();
    
            const onDone = () => { 
                this.allowRefresh = true; 
                this.animator = this.asset.getInstance().getAnimator();
                this.getAction()
                this.animationStartTime = Date.now();
                this.asset.releaseSourceData()
            }
    
            this.asset.loadResources(onDone, null, assetsPath+'/'+url);
            isRefresh = true
    
            this.asset.getInstance().createAvatar(this.engine, this.asset)
            this.avatar = this.asset.getInstance().getAvatar();
            this.avatar.Init("phone_to_bs_mean_1.txt", "blink.dat")
            
            lastFrameTime = 0.0
        }
    
        getAction() {
          query.select('#action').node().exec((res) => {
            var actionarray = [];
            const count = this.animator.getAnimationCount()
            if (count > 0) {
                res.disabled = false
                res.disabled = false
                for (let i = 0; i < count; i++) {
                    const name = this.animator.getAnimationName(i) || `action${i}`
                    actionarray.push(name)
                }
            } else {
                res.disabled = true
                res.disabled = true
            }
            that.setData({
              actionArray: actionarray
            })
        })
      }
    
        render() {
            if (!isRefresh) return
            const ms = Date.now() - this.animationStartTime;
            if (this.animator) {
                this.animator.applyAnimation(actionIndex, ms / 1000);
                this.animator.updateBoneMatrices();
            }
            this.avatar.ShowAvatar(ms / 1000);
            // Spin the model according to the trackball controller.
            const tcm = this.engine.getTransformManager();
            const inst = tcm.getInstance(this.assetRoot);
            //tcm.setTransform(inst, this.trackball.getMatrix());
            inst.delete();
    
            // Gradually add renderables to the scene as their textures become ready.
            let entity;
            const popRenderable = () => {
                entity = this.asset.popRenderable();
    
                return entity.getId() != 0;
            }
            while (popRenderable()) {
                this.scene.addEntity(entity);
                entity.delete();
            }
            entity.delete();
    
            // Render the scene and request the next animation frame.
            if (this.renderer.beginFrame(this.swapChain)) {
                this.renderer.renderView(this.view);
                this.renderer.endFrame();
            }
            this.engine.execute();
    
            canvas.requestAnimationFrame(this.render);
        }
    
        resize() {
            const width = this.canvas.width
            const height = this.canvas.height
            this.view.setViewport([0, 0, width, height]);
            const y = 1.5, eye = [0, y, 2.2], center = [0, y-0.8, -1], up = [0, 1, 0];
            this.camera.lookAt(eye, center, up);
            const aspect = width / height;
            const fov = aspect < 1 ? Fov.HORIZONTAL : Fov.VERTICAL;
            this.camera.setProjectionFov(50, aspect, 1.0, 10.0, fov);
        }   
      }
      
      CTEngine.init([DZ_url, dancing_url, ibl_url, sky_url, blink_dat, phone_to_bs_mean_1_txt, settingJson, default_settingJson, imageMaterial, image1, image2, image3, image4], () => {
        CTEngine().then(module => {
          CTEngine = Object.assign(module, CTEngine);
          CTEngine = CTEngine.loadClassExtensions();
          gltfio = CTEngine.gltfio;
          Fov = CTEngine.Camera$Fov;
          LightType = CTEngine.LightManager$Type;
          IndirectLight = CTEngine.IndirectLight;
          getApp().globalData.app = new App(canvas);
          getApp().globalData.CTEngine = CTEngine;
          isRefresh = true
        });
      });
    })
  }
})
