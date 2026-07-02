/* Pack-opening ceremony styles */

.pk-stage { width: 100%; max-width: 1100px; display: grid; place-items: center; text-align: center; }

/* --- Sealed pack --- */
.pk-sealed { display: grid; place-items: center; gap: 26px; }
.pk-sealed h2 { font-family:'Anton',sans-serif; font-size: clamp(30px,5vw,52px); margin: 0;
  text-transform: uppercase; letter-spacing: 1px; }
.pk-sealed h2 em { font-style: normal; color: var(--gold-lt); }
.pk-sealed p { margin: 0; color: #9fb0d0; max-width: 440px; }

.pk-pack {
  width: 230px; height: 330px; border-radius: 12px; position: relative; cursor: pointer;
  background:
    linear-gradient(135deg, rgba(255,255,255,.35) 0 12%, transparent 22%),
    repeating-linear-gradient(115deg, #163a6b 0 14px, #1d4a85 14px 28px),
    linear-gradient(160deg, #d8a72a, #b5851a);
  border: 2px solid rgba(255,255,255,.25);
  box-shadow: 0 26px 60px -16px rgba(0,0,0,.7), 0 0 0 1px rgba(0,0,0,.3) inset;
  display: grid; place-items: center; overflow: hidden;
  transition: transform .25s ease, box-shadow .25s ease;
  animation: pk-bob 3.4s ease-in-out infinite;
}
.pk-pack:hover { transform: translateY(-6px) scale(1.02); box-shadow: 0 32px 70px -14px rgba(216,167,42,.55); }
.pk-pack::before { content:''; position:absolute; inset:0;
  background: linear-gradient(115deg, transparent 35%, rgba(255,255,255,.55) 50%, transparent 65%);
  background-size: 250% 250%; animation: ec-sheen 4s ease-in-out infinite; mix-blend-mode: screen; }
.pk-pack-logo { position: relative; z-index: 2; display: grid; gap: 12px; justify-items: center; }
.pk-pack-plate { background: rgba(8,18,40,.9); border: 1px solid rgba(255,255,255,.25); border-radius: 10px;
  padding: 12px 16px; box-shadow: 0 6px 16px rgba(0,0,0,.4); }
.pk-pack-plate img { height: 36px; width: auto; display: block; }
.pk-pack-logo .ring { width: 60px; height: 60px; border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #fff, #1b3a63 65%); box-shadow: 0 0 0 4px var(--gold), 0 6px 16px rgba(0,0,0,.4); }
.pk-pack-logo .title { font-family:'Anton',sans-serif; font-size: 26px; text-transform: uppercase; letter-spacing:1px;
  color:#fff; text-shadow: 0 2px 6px rgba(0,0,0,.5); }
.pk-pack-logo .sub { font-family:'Anton',sans-serif; font-size: 14px; letter-spacing: 3px; color: #0a1730;
  background: #fff; padding: 3px 12px; border-radius: 4px; }
.pk-pack .tear { position:absolute; top:0; left:0; right:0; height: 26px;
  background: repeating-linear-gradient(90deg, #050d1f 0 9px, transparent 9px 18px) top/100% 12px no-repeat,
              rgba(255,255,255,.12);
  border-bottom: 2px dashed rgba(255,255,255,.4); }

.pk-btn {
  font-family:'Anton',sans-serif; text-transform: uppercase; letter-spacing: 1px; font-size: 18px;
  color:#0a1730; background: linear-gradient(180deg, #f3cf6b, #d8a72a);
  border: 2px solid rgba(0,0,0,.25); border-radius: 12px; padding: 13px 34px; cursor: pointer;
  box-shadow: 0 8px 22px -6px rgba(216,167,42,.7); }
.pk-btn:hover { filter: brightness(1.07); }
.pk-btn.ghost { background: rgba(255,255,255,.06); color: #dbe5fb; border-color: rgba(255,255,255,.2); box-shadow: none; }

/* pack rip animation */
.pk-pack.ripping { animation: pk-rip .55s ease forwards; }
@keyframes pk-rip {
  0% { transform: scale(1); }
  35% { transform: scale(1.08) rotate(-1deg); }
  100% { transform: scale(1.5) rotate(4deg); opacity: 0; filter: brightness(2); }
}
@keyframes pk-bob { 0%,100%{ transform: translateY(0);} 50%{ transform: translateY(-8px);} }

/* --- Reveal --- */
.pk-reveal { display: grid; place-items: center; gap: 22px; position: relative; }
.pk-counter { font-family:'Anton',sans-serif; font-size: 15px; letter-spacing: 2px; text-transform: uppercase; color:#9fb0d0; }
.pk-counter b { color: var(--gold-lt); }
.pk-cardwrap { position: relative; display: grid; place-items: center; min-height: 470px; }
.pk-cardwrap .ec-card { animation: pk-deal .45s cubic-bezier(.2,.9,.3,1) backwards; }
@keyframes pk-deal { from { transform: translateY(40px) scale(.85); opacity: 0; } to { transform: none; opacity: 1; } }

.pk-dots { display: flex; gap: 9px; }
.pk-dot { width: 11px; height: 11px; border-radius: 50%; background: rgba(255,255,255,.16);
  border: 1px solid rgba(255,255,255,.25); }
.pk-dot[data-state="current"] { background: var(--gold-lt); transform: scale(1.25); }
.pk-dot[data-state="done"] { background: var(--gold); }
.pk-dot[data-tier="mvp"], .pk-dot[data-tier="hof"] { box-shadow: 0 0 8px var(--gold-lt); }

.pk-hint { color:#8090b2; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; }

/* tier reveal flash */
.pk-flash { position: fixed; inset: 0; z-index: 5; pointer-events: none; display:grid; place-items:center;
  opacity: 0; }
.pk-flash.show { animation: pk-flash-in 1.5s ease forwards; }
.pk-flash .glow { position:absolute; inset:0; }
.pk-flash .banner { position: relative; font-family:'Anton',sans-serif; text-transform: uppercase;
  font-size: clamp(40px, 9vw, 110px); letter-spacing: 3px; color:#fff;
  text-shadow: 0 0 30px rgba(255,220,120,.8), 0 6px 20px rgba(0,0,0,.6); transform: scale(.6); }
.pk-flash.show .banner { animation: pk-banner .9s cubic-bezier(.2,1.4,.4,1) forwards; }
@keyframes pk-flash-in { 0%{opacity:0;} 15%{opacity:1;} 80%{opacity:1;} 100%{opacity:0;} }
@keyframes pk-banner { 0%{transform:scale(.5);opacity:0;} 50%{transform:scale(1.05);opacity:1;} 100%{transform:scale(1);opacity:1;} }

/* confetti particles */
.pk-particles { position: fixed; inset: 0; z-index: 6; pointer-events: none; overflow: hidden; }
.pk-particles i { position: absolute; top: -12px; width: 9px; height: 14px; border-radius: 2px;
  animation: pk-fall linear forwards; }
@keyframes pk-fall { to { transform: translateY(110vh) rotate(720deg); opacity: .2; } }

/* --- Summary fan --- */
.pk-summary { display: grid; place-items: center; gap: 24px; width: 100%; }
.pk-summary h2 { font-family:'Anton',sans-serif; font-size: clamp(28px,4vw,46px); margin:0; text-transform: uppercase; }
.pk-summary h2 em { font-style: normal; color: var(--gold-lt); }
.pk-fan { display: flex; gap: 18px; flex-wrap: wrap; justify-content: center; }
.pk-fan .ec-card { transform: scale(.82); margin: -22px -8px; }
.pk-best { font-size: 14px; letter-spacing: 1px; text-transform: uppercase; color:#9fb0d0; }
.pk-best b { color: var(--gold-lt); }
.pk-actions { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; }

@media (prefers-reduced-motion: reduce) {
  .pk-pack, .pk-pack::before, .pk-cardwrap .ec-card { animation: none; }
}
