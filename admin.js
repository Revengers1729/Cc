// Firebase Configuration - MUST BE IDENTICAL TO THE MAIN LUDO APP
const firebaseConfig = {
    apiKey: "AIzaSyB5U5YaSWsB0nwPBfZoFFbM7EM4_WiZ45A",
    authDomain: "aryan-ludo.firebaseapp.com",
    databaseURL: "https://aryan-ludo-default-rtdb.firebaseio.com/",
    projectId: "aryan-ludo",
    storageBucket: "aryan-ludo.firebasestorage.app",
    messagingSenderId: "826375754084",
    appId: "1:826375754084:web:11a74b9ca1dbd659ab2a71"
};


// Initialize Firebase Realtime Sync Engine
let db = null;
if(firebaseConfig.apiKey !== "YOUR_API_KEY") {
    firebase.initializeApp(firebaseConfig);
    db = firebase.database();
    document.getElementById('log-box').innerText = "System online. Realtime network connection stable.\n";
}

function sendRigCommand(playerColor, diceValue) {
    logMessage(`Sending injection vector: ${playerColor.toUpperCase()} next roll to be [${diceValue}]...`);
    
    if (!db) {
        logMessage("Error: Firebase configurations missing. Update files with valid database keys.");
        alert("Please set up Firebase configuration credentials first inside admin.js!");
        return;
    }
    
    db.ref('riggedRolls/' + playerColor).set({
        diceValue: diceValue,
        isUsed: false
    }).then(() => {
        logMessage(`Success: ${playerColor.toUpperCase()} database key overridden successfully.`);
        document.getElementById(`status-${playerColor}`).innerText = `Rigged: Set to execute [ ${diceValue} ]`;
        document.getElementById(`status-${playerColor}`).style.color = '#4ade80';
    }).catch((err) => {
        logMessage(`Error writing payload: ${err.message}`);
    });
}

// Watch status loops live from game triggers to clear indicators automatically
if (db) {
    db.ref('riggedRolls').on('value', (snapshot) => {
        const data = snapshot.val() || {};
        Object.keys(data).forEach(color => {
            const indicator = document.getElementById(`status-${color}`);
            if (data[color].isUsed) {
                indicator.innerText = "Status: Transmitted & Discharged (Normal Random)";
                indicator.style.color = '#64748b';
            }
        });
    });
}

function logMessage(text) {
    const box = document.getElementById('log-box');
    const d = new Date();
    const stamp = `[${d.toLocaleTimeString()}] `;
    box.innerText += stamp + text + "\n";
    box.scrollTop = box.scrollHeight;
}
