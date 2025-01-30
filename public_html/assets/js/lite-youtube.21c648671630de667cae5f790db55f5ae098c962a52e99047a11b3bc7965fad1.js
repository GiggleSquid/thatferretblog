export class LiteYTEmbed extends HTMLElement{constructor(){super(),this.isIframeLoaded=!1,this.setupDom()}static get observedAttributes(){return["videoid","playlistid","videoplay","videotitle"]}connectedCallback(){this.addEventListener("pointerover",()=>LiteYTEmbed.warmConnections(this),{once:!0}),this.addEventListener("click",()=>this.addIframe())}get videoId(){return encodeURIComponent(this.getAttribute("videoid")||"")}set videoId(e){this.setAttribute("videoid",e)}get playlistId(){return encodeURIComponent(this.getAttribute("playlistid")||"")}set playlistId(e){this.setAttribute("playlistid",e)}get videoTitle(){return this.getAttribute("videotitle")||"Video"}set videoTitle(e){this.setAttribute("videotitle",e)}get videoPlay(){return this.getAttribute("videoplay")||"Play"}set videoPlay(e){this.setAttribute("videoplay",e)}get videoStartAt(){return this.getAttribute("videoStartAt")||"0"}get autoLoad(){return this.hasAttribute("autoload")}get autoPause(){return this.hasAttribute("autopause")}get noCookie(){return this.hasAttribute("nocookie")}get posterQuality(){return this.getAttribute("posterquality")||"hqdefault"}get posterLoading(){return this.getAttribute("posterloading")||"lazy"}get params(){return`start=${this.videoStartAt}&${this.getAttribute("params")}`}set params(e){this.setAttribute("params",e)}setupDom(){const e=this.attachShadow({mode:"open"});let t="";window.liteYouTubeNonce&&(t=`nonce="${window.liteYouTubeNonce}"`),e.innerHTML=`
      <style ${t}>
        :host {
          --aspect-ratio: var(--lite-youtube-aspect-ratio, 16 / 9);
          --aspect-ratio-short: var(--lite-youtube-aspect-ratio-short, 9 / 16);
          --frame-shadow-visible: var(--lite-youtube-frame-shadow-visible, yes);
          contain: content;
          display: block;
          position: relative;
          width: 100%;
          aspect-ratio: var(--aspect-ratio);
        }

        @media (max-width: 40em) {
          :host([short]) {
            aspect-ratio: var(--aspect-ratio-short);
          }
        }

        #frame, #fallbackPlaceholder, iframe {
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
        }

        #frame {
          cursor: pointer;
        }

        #fallbackPlaceholder, slot[name=image]::slotted(*) {
          object-fit: cover;
          width: 100%;
        }

        @container style(--frame-shadow-visible: yes) {
          #frame::before {
            content: '';
            display: block;
            position: absolute;
            top: 0;
            background-image: linear-gradient(180deg, #111 -20%, transparent 90%);
            height: 60px;
            width: 100%;
            z-index: 1;
          }
        }

        #playButton {
          width: 68px;
          height: 48px;
          background-color: transparent;
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 68 48"><path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="red"/><path d="M45 24 27 14v20" fill="white"/></svg>');
          z-index: 1;
          border: 0;
          border-radius: inherit;
        }

        #playButton:before {
          content: '';
          border-style: solid;
          border-width: 11px 0 11px 19px;
          border-color: transparent transparent transparent #fff;
        }

        #playButton,
        #playButton:before {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate3d(-50%, -50%, 0);
          cursor: inherit;
        }

        /* Post-click styles */
        .activated {
          cursor: unset;
        }

        #frame.activated::before,
        #frame.activated > #playButton {
          display: none;
        }
      </style>
      <div id="frame">
        <picture>
          <slot name="image">
            <source id="webpPlaceholder" type="image/webp">
            <source id="jpegPlaceholder" type="image/jpeg">
            <img id="fallbackPlaceholder" referrerpolicy="origin" loading="lazy">
          </slot>
        </picture>
        <button id="playButton"></button>
      </div>
    `,this.domRefFrame=e.querySelector("#frame"),this.domRefImg={fallback:e.querySelector("#fallbackPlaceholder"),webp:e.querySelector("#webpPlaceholder"),jpeg:e.querySelector("#jpegPlaceholder")},this.domRefPlayButton=e.querySelector("#playButton")}setupComponent(){this.initImagePlaceholder(),this.domRefPlayButton.setAttribute("aria-label",`${this.videoPlay}: ${this.videoTitle}`),this.setAttribute("title",`${this.videoPlay}: ${this.videoTitle}`),(this.autoLoad||this.isYouTubeShort()||this.autoPause)&&this.initIntersectionObserver()}attributeChangedCallback(e,t,n){t!==n&&(this.setupComponent(),this.domRefFrame.classList.contains("activated")&&(this.domRefFrame.classList.remove("activated"),this.shadowRoot.querySelector("iframe").remove(),this.isIframeLoaded=!1))}addIframe(e=!1){if(!this.isIframeLoaded){let n=e?0:1;const s=this.noCookie?"-nocookie":"";let t;this.playlistId?t=`?listType=playlist&list=${this.playlistId}&`:t=`${this.videoId}?`,this.autoPause&&(this.params=`enablejsapi=1`),this.isYouTubeShort()&&(this.params=`loop=1&mute=1&modestbranding=1&playsinline=1&rel=0&enablejsapi=1&playlist=${this.videoId}`,n=1);const o=`
<iframe credentialless frameborder="0" title="${this.videoTitle}"
  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
  src="https://www.youtube${s}.com/embed/${t}autoplay=${n}&${this.params}"
></iframe>`;this.domRefFrame.insertAdjacentHTML("beforeend",o),this.domRefFrame.classList.add("activated"),this.isIframeLoaded=!0,this.attemptShortAutoPlay(),this.dispatchEvent(new CustomEvent("liteYoutubeIframeLoaded",{detail:{videoId:this.videoId},bubbles:!0,cancelable:!0}))}}initImagePlaceholder(){const t=`https://i.ytimg.com/vi_webp/${this.videoId}/${this.posterQuality}.webp`,e=`https://i.ytimg.com/vi/${this.videoId}/${this.posterQuality}.jpg`;this.domRefImg.fallback.loading=this.posterLoading,this.domRefImg.webp.srcset=t,this.domRefImg.jpeg.srcset=e,this.domRefImg.fallback.src=e,this.domRefImg.fallback.setAttribute("aria-label",`${this.videoPlay}: ${this.videoTitle}`),this.domRefImg?.fallback?.setAttribute("alt",`${this.videoPlay}: ${this.videoTitle}`)}initIntersectionObserver(){const e={root:null,rootMargin:"0px",threshold:0},t=new IntersectionObserver((e,t)=>{e.forEach(e=>{e.isIntersecting&&!this.isIframeLoaded&&(LiteYTEmbed.warmConnections(this),this.addIframe(!0),t.unobserve(this))})},e);if(t.observe(this),this.autoPause){const e=new IntersectionObserver((e)=>{e.forEach(e=>{e.intersectionRatio!==1&&this.shadowRoot.querySelector("iframe")?.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}',"*")})},{threshold:1});e.observe(this)}}attemptShortAutoPlay(){this.isYouTubeShort()&&setTimeout(()=>{this.shadowRoot.querySelector("iframe")?.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}',"*")},2e3)}isYouTubeShort(){return this.getAttribute("short")===""&&window.matchMedia("(max-width: 40em)").matches}static addPrefetch(e,t){const n=document.createElement("link");n.rel=e,n.href=t,n.crossOrigin="true",document.head.append(n)}static warmConnections(e){if(LiteYTEmbed.isPreconnected||window.liteYouTubeIsPreconnected)return;LiteYTEmbed.addPrefetch("preconnect","https://i.ytimg.com/"),LiteYTEmbed.addPrefetch("preconnect","https://s.ytimg.com"),e.noCookie?LiteYTEmbed.addPrefetch("preconnect","https://www.youtube-nocookie.com"):(LiteYTEmbed.addPrefetch("preconnect","https://www.youtube.com"),LiteYTEmbed.addPrefetch("preconnect","https://www.google.com"),LiteYTEmbed.addPrefetch("preconnect","https://googleads.g.doubleclick.net"),LiteYTEmbed.addPrefetch("preconnect","https://static.doubleclick.net")),LiteYTEmbed.isPreconnected=!0,window.liteYouTubeIsPreconnected=!0}}LiteYTEmbed.isPreconnected=!1,customElements.define("lite-youtube",LiteYTEmbed)