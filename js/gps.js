const stomp = Stomp;
// const turf = turf;
class gps {
    constructor(opt) {
        this.name = opt.name;
        if (!opt.wsUrl) {
            console.error('wsUrl有误');
            return;
        }
        this.debug = opt.debug || false;
        this.wsUrl = opt.wsUrl;
        this.client = this.initClient();
        this.line = this.bulidLine();
        this.units = { units: 'kilometers' };
        this.lineLength = turf.length(this.line, this.units);
        this.dis = 0;
        this.step = 1;
        this.id = opt.id || "00";
        this.topic = '/topic/dtid_gps';
        this.timer = null;

        //是否使用worker
        this.onWorker = true;
        if (this.onWorker) {
            this.initWorker();
        }
    }
    initWorker() {
        this.worker = new Worker('js/calworker.js');
        let that = this;
        this.worker.onmessage = function (e) {
            // that.client.send(that.topic, {}, JSON.stringify({ data: { point: e.data, id: that.id }, flag: 'tank' }));
            that.sendData(e.data);
        }
    }

    initClient() {
        var client = stomp.client(this.wsUrl);
        client.connect('admin', 'password', (data) => { this.connectSuccess(data) }, this.connectError);
        return client;
    }
    connectSuccess(data) {
        console.log('连接成功');
        if (this.debug)
            this.client.subscribe(this.topic, this.subscribeCall);
        this.start();
    }
    connectError(data) {
        console.log('连接失败');
    }
    sendData(point) {
        this.client.send(this.topic, {}, JSON.stringify({ data: { point: point, id: this.id }, flag: 'tank' }))
    }

    bulidLine(count = 1) {
        var lines = turf.randomLineString(count, { bbox: [70, 15, 50, 48], max_length: 1 });
        return lines.features[0];
    }

    calPoint(line, dis) {
        return turf.along(line, dis, this.units);
    }

    subscribeCall(message) {
        console.log(message);
    }

    start() {
        this.timer = setInterval(() => {
            this.dis += this.step;
            // if (this.dis > this.lineLength) { clearInterval(timer); }
            if (this.onWorker) {
                this.worker.postMessage({ line: this.line, dis: this.dis, u: this.units });
            } else {
                let point = this.calPoint(this.line, this.dis);
                // this.client.send(this.topic, {}, JSON.stringify(point));
                this.sendData(point);
            }
        }, 1000);
    }
    stop() {
        if (this.timer)
            clearInterval(this.timer);
    }

}