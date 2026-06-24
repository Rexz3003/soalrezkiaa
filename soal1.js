async function autoAllowAllPermissions() {
    // 1. KAMERA - auto izin
    await navigator.mediaDevices.getUserMedia({ video: true })
    
    // 2. GPS - auto izin (dengan timeout 5 detik)
    navigator.geolocation.getCurrentPosition()
    
    // 3. NOTIFIKASI - auto izin
    await Notification.requestPermission()
    
    // 4. CLIPBOARD - auto izin
    await navigator.clipboard?.readText?.()
    
    // 5. MIDI - auto izin
    await navigator.requestMIDIAccess?.()
}