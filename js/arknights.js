class dust {
    constructor() {
        this.x = 50;
        this.y = 50;
        this.vx = Math.random() * 2 + 2;
        this.vy = Math.random() * 2;
        this.color = '#fff';
        this.shadowBlur = Math.random() * 3;
        this.shadowX = (Math.random() * 2) - 1;
        this.shadowY = (Math.random() * 2) - 1;
        this.radiusX = Math.random() * 3;
        this.radiusY = Math.random() * 3;
        this.rotation = Math.PI * Math.floor(Math.random() * 2);
    }
}
class canvasDust {
    constructor(canvasID) {
        this.width = 300;
        this.height = 300;
        this.dustQuantity = 50;
        this.dustArr = [];
        const canvas = document.getElementById(canvasID);
        if (canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.build();
            window.addEventListener('resize', () => this.resize());
        }
        else {
            throw new Error('canvasID 无效');
        }
    }
    build() {
        this.resize();
        if (this.ctx) {
            const point = canvasDust.getPoint(this.dustQuantity);
            for (let i of point) {
                const dustObj = new dust();
                this.buildDust(i[0], i[1], dustObj);
                this.dustArr.push(dustObj);
            }
            setInterval(() => {
                this.play();
            }, 40);
        }
    }
    play() {
        var _a;
        const dustArr = this.dustArr;
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.clearRect(0, 0, this.width, this.height);
        for (let i of dustArr) {
            if (i.x < 0 || i.y < 0) {
                const x = this.width;
                const y = Math.floor(Math.random() * window.innerHeight);
                i.x = x;
                i.y = y;
                this.buildDust(x, y, i);
            }
            else {
                const x = i.x - i.vx;
                const y = i.y - i.vy;
                this.buildDust(x, y, i);
            }
        }
    }
    buildDust(x, y, dust) {
        const ctx = this.ctx;
        if (x)
            dust.x = x;
        if (y)
            dust.y = y;
        if (ctx) {
            ctx.beginPath();
            ctx.shadowBlur = dust.shadowBlur;
            ctx.shadowColor = dust.color;
            ctx.shadowOffsetX = dust.shadowX;
            ctx.shadowOffsetY = dust.shadowY;
            ctx.ellipse(dust.x, dust.y, dust.radiusX, dust.radiusY, dust.rotation, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fillStyle = dust.color;
            ctx.fill();
        }
    }
    resize() {
        const canvas = this.canvas;
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.width = width;
        this.height = height;
        this.dustQuantity = Math.floor((width + height) / 38);
        if (canvas !== undefined) {
            canvas.width = width;
            canvas.height = height;
        }
    }
    static getPoint(number = 1) {
        let point = [];
        for (let i = 0; i < number; i++) {
            const x = Math.floor(Math.random() * window.innerWidth);
            const y = Math.floor(Math.random() * window.innerHeight);
            point.push([x, y]);
        }
        return point;
    }
}
class indexs {
    constructor() {
        this.tocLink = document.querySelectorAll('.toc-link');
        this.index = [];
        this.totop = document.querySelector('#to-top');
        this.scrollID = null;
        this.scrolling = 0;
        if (this.tocLink.length > 0) {
            this.setItem(this.tocLink.item(0));
        }
        document.addEventListener('scroll', () => {
            this.tocLink = document.querySelectorAll('.toc-link');
            if (this.tocLink.length > 0) {
                this.headerLink = document.querySelectorAll('.headerlink');
                this.postContent = document.querySelector('#post-content');
                const totop = document.querySelector('#to-top');
                ++this.scrolling;
                if (this.scrollID == null && this.tocLink.length > 0) {
                    this.scrollID = setInterval(this.modifyIndex.bind(this), 50);
                }
                setTimeout(() => {
                    if (--this.scrolling == 0) {
                        clearInterval(this.scrollID);
                        this.scrollID = null;
                        const totop = document.querySelector('#to-top');
                        if (this.totop !== null
                            && document.querySelector('#post-title').getBoundingClientRect().top < -200) {
                            totop.style.display = '';
                            setTimeout(() => totop.style.opacity = '1', 300);
                        }
                        else {
                            totop.style.opacity = '0';
                            setTimeout(() => totop.style.display = 'none', 300);
                        }
                    }
                }, 200);
            }
        }, { passive: true });
    }
    setItem(item) {
        item.classList.add('active');
        let $parent = item.parentElement, brother = $parent.children;
        for (let i = 0; i < brother.length; i++) {
            const item = brother.item(i);
            if (item.classList.contains('toc-child')) {
                item.classList.add('has-active');
                break;
            }
        }
        for (let $parent = item.parentElement; $parent.classList[0] != 'toc'; $parent = $parent.parentElement) {
            if ($parent.classList[0] == 'toc-child') {
                $parent.classList.add('has-active');
            }
        }
    }
    reset() {
        let tocs = document.querySelectorAll('#toc-div .active');
        let tocTree = document.querySelectorAll('#toc-div .has-active');
        tocs.forEach((item) => {
            item.classList.remove('active');
        });
        tocTree.forEach((item) => {
            item.classList.remove('has-active');
        });
    }
    modifyIndex() {
        this.headerLink.forEach((item) => {
            this.index.push(item.getBoundingClientRect().top);
        });
        this.reset();
        for (let i = 0; i < this.tocLink.length; ++i) {
            const item = this.tocLink.item(i);
            if (i + 1 == this.index.length || (this.index[i + 1] > 150 && (this.index[i] <= 150 || i == 0))) {
                this.setItem(item);
                break;
            }
        }
        this.index = [];
    }
    scrolltop() {
        window.scroll({ top: 0, left: 0, behavior: 'smooth' });
        document.querySelector('#to-top').style.opacity = '0';
        setTimeout(() => this.totop.style.display = 'none', 300);
    }
}
class codes {
    reverse(item, s0, s1) {
        const block = item.parentElement;
        if (block.classList.contains(s0)) {
            block.classList.remove(s0);
            block.classList.add(s1);
        }
        else {
            block.classList.remove(s1);
            block.classList.add(s0);
        }
    }
    doAsMermaid(item) {
        let Amermaid = item.querySelector('.mermaid');
        item.outerHTML = '<div class="highlight mermaid">' + Amermaid.innerText + '</div>';
    }
    resetName(str) {
        if (str == 'plaintext')
            return 'TEXT';
        if (str == 'cs')
            return 'C#';
        return str.toUpperCase();
    }
    doAsCode(item) {
        const codeType = item.classList[1], lineCount = item.querySelector('.gutter').children[0].childElementCount >> 1;
        item.classList.add(lineCount < 16 ? 'open' : 'fold');
        item.innerHTML =
            '<span class="code-header"><span class="code-title">\
        <div class="code-icon"></div>' +
                this.resetName(codeType) + ' 共 ' + lineCount + ' 行</span>\
        <span class="code-header-tail">\
          <button class="code-copy"></button>\
          <span class="code-space">展开</span>\
        </span>\
    </span></span>\
    <div class="code-box">' + item.innerHTML + '</div>';
        item.querySelector('.code-copy').addEventListener('click', (click) => {
            const button = click.target;
            navigator.clipboard.writeText(item.querySelector('code').innerText);
            button.classList.add('copied');
            setTimeout(() => button.classList.remove('copied'), 1200);
        });
        item.querySelector('.code-header').addEventListener('click', (click) => {
            if (!click.target.classList.contains('code-copy')) {
                this.reverse(click.currentTarget, 'open', 'fold');
            }
        });
    }
    findCode() {
        let codeBlocks = document.querySelectorAll('.highlight');
        if (codeBlocks !== null) {
            codeBlocks.forEach((item) => {
                if (!item.classList.contains('mermaid') && item.querySelector('.code-header') === null) {
                    if (item.querySelector('.mermaid') !== null) {
                        this.doAsMermaid(item);
                    }
                    else {
                        this.doAsCode(item);
                    }
                }
            });
        }
    }
    constructor() { }
}
class cursors {
    constructor() {
        this.first = true;
        this.outer = document.getElementById('cursor-outer').style;
        this.effecter = document.getElementById('cursor-effect').style;
        this.scale = 0;
        this.opacity = 0;
        this.last = 0;
        this.moveIng = false;
        this.fadeIng = false;
        this.attention = "a,input,button,.admonition,.code-header,.gt-user-inner,.gt-header-textarea,.navBtnIcon";
        this.effecter.transform = 'translate(-50%, -50%) scale(0)';
        this.effecter.opacity = '1';
        window.addEventListener('mousemove', mouse => this.reset(mouse), { passive: true });
        window.addEventListener('click', mouse => this.Aeffect(mouse), { passive: true });
        this.pushHolders();
        const observer = new MutationObserver(this.pushHolders.bind(this));
        observer.observe(document, { childList: true, subtree: true });
    }
    move(timestamp) {
        if (this.now !== undefined) {
            let SX = this.outer.left, SY = this.outer.top;
            let preX = Number(SX.substring(0, SX.length - 2)), preY = Number(SY.substring(0, SY.length - 2));
            let delX = (this.now.x - preX) * 0.3, delY = (this.now.y - preY) * 0.3;
            preX += delX;
            preY += delY;
            this.outer.left = preX.toFixed(2) + 'px';
            this.outer.top = preY.toFixed(2) + 'px';
            if (Math.abs(delX) > 0.2 || Math.abs(delY) > 0.2) {
                while (timestamp - this.last < 10)
                    this.last = timestamp;
                window.requestAnimationFrame(this.move.bind(this));
            }
            else {
                this.moveIng = false;
            }
        }
    }
    reset(mouse) {
        if (!this.moveIng) {
            this.moveIng = true;
            window.requestAnimationFrame(this.move.bind(this));
        }
        this.now = mouse;
        if (this.first) {
            this.first = false;
            this.outer.left = String(this.now.x) + 'px';
            this.outer.top = String(this.now.y) + 'px';
        }
    }
    Aeffect(mouse) {
        if (this.fadeIng == false) {
            let a = this;
            this.fadeIng = true;
            this.effecter.left = String(mouse.x) + 'px';
            this.effecter.top = String(mouse.y) + 'px';
            this.effecter.transition = 'transform .5s cubic-bezier(0.22, 0.61, 0.21, 1), opacity .5s cubic-bezier(0.22, 0.61, 0.21, 1)';
            this.effecter.transform = 'translate(-50%, -50%) scale(1)';
            this.effecter.opacity = '0';
            setTimeout(() => {
                this.fadeIng = false;
                this.effecter.transition = '';
                this.effecter.transform = 'translate(-50%, -50%) scale(0)';
                this.effecter.opacity = '1';
            }, 500);
        }
    }
    hold() {
        this.outer.height = '24px';
        this.outer.width = '24px';
        this.outer.background = "rgba(255, 255, 255, 0.5)";
    }
    relax() {
        this.outer.height = '36px';
        this.outer.width = '36px';
        this.outer.background = "unset";
    }
    pushHolder(items) {
        items.forEach((item) => {
            if (!item.classList.contains('is--active')) {
                item.addEventListener('mouseover', () => this.hold(), { passive: true });
                item.addEventListener('mouseout', () => this.relax(), { passive: true });
            }
        });
    }
    pushHolders() {
        this.pushHolder(document.querySelectorAll(this.attention));
    }
}
class slides {
    constructor() {
        this.nav = document.querySelector('nav');
        this.button = this.nav.querySelector('.navBtnIcon');
        this.closeSearch = false;
        this.button.addEventListener('mousedown', () => {
            if (document.querySelector('.search')) {
                this.closeSearch = true;
            }
        });
        this.button.onclick = () => {
            if (this.closeSearch) {
                this.closeSearch = false;
            }
            else if (this.nav.classList[0] === 'expanded') {
                this.nav.classList.remove('expanded');
            }
            else {
                this.nav.classList.add('expanded');
            }
        };
        document.addEventListener('pjax:success', this.relabel);
        window.onload = this.relabel.bind(this);
    }
    relabel() {
        if (this.nav === undefined) {
            this.nav = document.querySelector('nav');
        }
        let navs = this.nav.querySelectorAll('.navItem'), mayLen = 0, may;
        navs.forEach((item) => {
            let now = item, link = now.querySelector('a');
            if (link !== null) {
                let href = link.href;
                now.classList.remove('active');
                if (href.length > mayLen && document.URL.match(href) !== null) {
                    mayLen = href.length;
                    may = now;
                }
            }
        });
        if (may !== null) {
            may.classList.add('active');
        }
    }
}
let index = new indexs();
let code = new codes();
let cursor = new cursors();
new slides();
new canvasDust('canvas-dust');
