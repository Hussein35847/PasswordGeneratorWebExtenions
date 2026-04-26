// DOM Elements
const generatorCard = document.getElementById('generatorCard');
const passwordText = document.getElementById('passwordText');
const copyBtn = document.getElementById('copyBtn');
const lengthSlider = document.getElementById('lengthSlider');
const lengthValue = document.getElementById('lengthValue');
const generateBtn = document.getElementById('generateBtn');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');
const toast = document.getElementById('toast');
const entropyText = document.getElementById('entropyText');

// Test Checker Elements
const testPasswordInput = document.getElementById('testPasswordInput');
const testStrengthBar = document.getElementById('testStrengthBar');
const testStrengthText = document.getElementById('testStrengthText');
const testEntropyText = document.getElementById('testEntropyText');
const toggleTestVisibilityBtn = document.getElementById('toggleTestVisibilityBtn');

// Vault Modals
const openVaultBtn = document.getElementById('openVaultBtn');
const saveBtn = document.getElementById('saveBtn');
const toggleVisibilityBtn = document.getElementById('toggleVisibilityBtn');

const loginModal = document.getElementById('loginModal');
const masterPasswordInput = document.getElementById('masterPasswordInput');
const toggleMasterVisibilityBtn = document.getElementById('toggleMasterVisibilityBtn');
const unlockVaultBtn = document.getElementById('unlockVaultBtn');
const cancelLoginBtn = document.getElementById('cancelLoginBtn');

const saveConfirmModal = document.getElementById('saveConfirmModal');
const saveNameInput = document.getElementById('saveNameInput');
const confirmSaveBtn = document.getElementById('confirmSaveBtn');
const cancelSaveBtn = document.getElementById('cancelSaveBtn');

const vaultModal = document.getElementById('vaultModal');
const vaultList = document.getElementById('vaultList');
const closeVaultBtn = document.getElementById('closeVaultBtn');
const lockVaultBtn = document.getElementById('lockVaultBtn');

// Type Radios
const typeRadios = document.getElementsByName('pwdType');

// Checkboxes
const chkUpper = document.getElementById('chkUpper');
const chkLower = document.getElementById('chkLower');
const chkNumbers = document.getElementById('chkNumbers');
const chkSymbols = document.getElementById('chkSymbols');

// Presets
const presetBtns = document.querySelectorAll('.preset-btn');
const presets = {
    custom: null,
    gmail: { length: 16, type: 'all', upper: true, lower: true, numbers: true, symbols: true },
    wifi: { length: 20, type: 'read', upper: true, lower: true, numbers: true, symbols: false },
    apple: { length: 16, type: 'all', upper: true, lower: true, numbers: true, symbols: false },
    crypto: { length: 32, type: 'all', upper: true, lower: true, numbers: true, symbols: true },
    pin: { length: 6, type: 'all', upper: false, lower: false, numbers: true, symbols: false }
};

// Character Sets
const charSets = {
    all: {
        upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lower: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+~|}{[]:;?><,./-='
    },
    read: {
        upper: 'ABCDEFGHJKLMNPQRSTUVWXYZ',
        lower: 'abcdefghijkmnopqrstuvwxyz',
        numbers: '23456789',
        symbols: '!@#$%^&*_+~?-='
    }
};

const syllables = [
    'ba', 'be', 'bi', 'bo', 'bu', 'by',
    'ca', 'ce', 'ci', 'co', 'cu', 'cy',
    'da', 'de', 'di', 'do', 'du', 'dy',
    'fa', 'fe', 'fi', 'fo', 'fu', 'fy',
    'ga', 'ge', 'gi', 'go', 'gu', 'gy',
    'ha', 'he', 'hi', 'ho', 'hu', 'hy',
    'ja', 'je', 'ji', 'jo', 'ju', 'jy',
    'ka', 'ke', 'ki', 'ko', 'ku', 'ky',
    'la', 'le', 'li', 'lo', 'lu', 'ly',
    'ma', 'me', 'mi', 'mo', 'mu', 'my',
    'na', 'ne', 'ni', 'no', 'nu', 'ny',
    'pa', 'pe', 'pi', 'po', 'pu', 'py',
    'ra', 're', 'ri', 'ro', 'ru', 'ry',
    'sa', 'se', 'si', 'so', 'su', 'sy',
    'ta', 'te', 'ti', 'to', 'tu', 'ty',
    'va', 've', 'vi', 'vo', 'vu', 'vy',
    'wa', 'we', 'wi', 'wo', 'wu', 'wy',
    'ya', 'ye', 'yi', 'yo', 'yu',
    'za', 'ze', 'zi', 'zo', 'zu', 'zy'
];

let currentType = 'all';

// =============== PASSWORD GENERATOR LOGIC ===============

function setCustomPreset() {
    presetBtns.forEach(b => b.classList.remove('active'));
    const customBtn = document.querySelector('.preset-btn[data-preset="custom"]');
    if (customBtn) customBtn.classList.add('active');
}

presetBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        presetBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        const presetKey = e.target.getAttribute('data-preset');
        if (presetKey !== 'custom') {
            const config = presets[presetKey];
            
            lengthSlider.value = config.length;
            lengthValue.textContent = config.length;
            updateSliderBackground();

            document.querySelector(`input[name="pwdType"][value="${config.type}"]`).checked = true;
            currentType = config.type;
            
            chkUpper.checked = config.upper;
            chkLower.checked = config.lower;
            chkNumbers.checked = config.numbers;
            chkSymbols.checked = config.symbols;

            updateCheckboxState();
            generatePassword();
        }
    });
});

lengthSlider.addEventListener('input', (e) => {
    lengthValue.textContent = e.target.value;
    updateSliderBackground();
    setCustomPreset();
    generatePassword();
});

typeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        currentType = e.target.value;
        updateCheckboxState();
        setCustomPreset();
        generatePassword();
    });
});

[chkUpper, chkLower, chkNumbers, chkSymbols].forEach(chk => {
    chk.addEventListener('change', () => {
        setCustomPreset();
        generatePassword();
    });
});

generateBtn.addEventListener('click', generatePassword);

passwordText.addEventListener('input', (e) => {
    calculateStrength(e.target.value);
});

testPasswordInput.addEventListener('input', (e) => {
    calculateTestStrength(e.target.value);
});

function togglePasswordVisibility(inputEl, btnEl) {
    if (inputEl.type === 'password') {
        inputEl.type = 'text';
        btnEl.innerHTML = '<svg class="eye-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';
    } else {
        inputEl.type = 'password';
        btnEl.innerHTML = '<svg class="eye-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
    }
}

if (toggleVisibilityBtn) {
    toggleVisibilityBtn.addEventListener('click', () => togglePasswordVisibility(passwordText, toggleVisibilityBtn));
}

if (toggleTestVisibilityBtn) {
    toggleTestVisibilityBtn.addEventListener('click', () => togglePasswordVisibility(testPasswordInput, toggleTestVisibilityBtn));
}

if (toggleMasterVisibilityBtn) {
    toggleMasterVisibilityBtn.addEventListener('click', () => {
        if (masterPasswordInput.type === 'password') {
            masterPasswordInput.type = 'text';
            toggleMasterVisibilityBtn.innerHTML = '<svg class="eye-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';
        } else {
            masterPasswordInput.type = 'password';
            toggleMasterVisibilityBtn.innerHTML = '<svg class="eye-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
        }
    });
}

copyBtn.addEventListener('click', () => {
    if (!passwordText.value || passwordText.value === "Click 'Generate'") return;

    navigator.clipboard.writeText(passwordText.value).then(() => {
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        copyBtn.classList.add('copied');

        showToast("Password Copied!");

        setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
            copyBtn.classList.remove('copied');
        }, 2000);
    });
});

function updateCheckboxState() {
    const isSay = currentType === 'say';

    chkNumbers.disabled = isSay;
    chkSymbols.disabled = isSay;

    chkNumbers.parentElement.classList.toggle('disabled', isSay);
    chkSymbols.parentElement.classList.toggle('disabled', isSay);

    if (isSay) {
        chkNumbers.checked = false;
        chkSymbols.checked = false;
        if (!chkUpper.checked && !chkLower.checked) {
            chkLower.checked = true;
        }
    }
}

function getSecureRandomValue(max) {
    if (max <= 0) return 0;
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % max;
}

function getRandomChar(str) {
    if (!str.length) return '';
    return str.charAt(getSecureRandomValue(str.length));
}

function shuffleString(str) {
    const arr = str.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        const j = getSecureRandomValue(i + 1);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
}

function generatePassword() {
    const length = parseInt(lengthSlider.value);
    let password = '';

    if (currentType === 'say') {
        password = generatePronounceable(length);
    } else {
        password = generateStandard(length, currentType);
    }

    if (!password || password.length === 0) {
        password = 'Select an option!';
        passwordText.value = password;
        if (entropyText) entropyText.textContent = '';
        updateStrength(0);
        return;
    }

    passwordText.value = password;
    calculateStrength(password);
}

function generateStandard(length, type) {
    const useUpper = chkUpper.checked;
    const useLower = chkLower.checked;
    const useNumbers = chkNumbers.checked;
    const useSymbols = chkSymbols.checked;

    if (!useUpper && !useLower && !useNumbers && !useSymbols) return '';

    let allowedChars = '';
    const sets = charSets[type];
    let result = '';

    if (useUpper) { allowedChars += sets.upper; result += getRandomChar(sets.upper); }
    if (useLower) { allowedChars += sets.lower; result += getRandomChar(sets.lower); }
    if (useNumbers) { allowedChars += sets.numbers; result += getRandomChar(sets.numbers); }
    if (useSymbols) { allowedChars += sets.symbols; result += getRandomChar(sets.symbols); }

    for (let i = result.length; i < length; i++) {
        result += getRandomChar(allowedChars);
    }

    return shuffleString(result);
}

function generatePronounceable(length) {
    const useUpper = chkUpper.checked;
    const useLower = chkLower.checked;
    if (!useUpper && !useLower) return '';

    let result = '';
    while (result.length < length) {
        let syl = syllables[getSecureRandomValue(syllables.length)];

        if (useUpper && !useLower) {
            syl = syl.toUpperCase();
        } else if (useUpper && useLower) {
            if (getSecureRandomValue(2) === 1) {
                syl = syl.charAt(0).toUpperCase() + syl.slice(1);
            }
        }
        result += syl;
    }
    return result.substring(0, length);
}

function calculateEntropy(password, type) {
    if (password === 'Select an option!' || !password) return 0;

    let poolSize = 0;
    if (type === 'say') {
        const syllablesCount = Math.max(1, Math.round(password.length / 2));
        return syllablesCount * Math.log2(syllables.length);
    }

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[^A-Za-z0-9]/.test(password);

    if (hasUpper) poolSize += 26;
    if (hasLower) poolSize += 26;
    if (hasNumbers) poolSize += 10;
    if (hasSymbols) poolSize += 32;

    if (type === 'read') {
        if (hasUpper) poolSize -= 2;
        if (hasLower) poolSize -= 1;
        if (hasNumbers) poolSize -= 2;
        if (hasSymbols) poolSize -= 18;
    }

    if (poolSize === 0) return 0;
    return password.length * Math.log2(poolSize);
}

function calculateStrength(password) {
    if (password === 'Select an option!' || !password) {
        updateStrength(0);
        if (entropyText) entropyText.textContent = '';
        return;
    }
    const entropy = Math.round(calculateEntropy(password, currentType));
    if (entropyText) entropyText.textContent = `~${entropy} bits`;

    const score = Math.max(0, Math.min(100, (entropy / 90) * 100));
    updateStrength(score, entropy);
}

function updateStrength(score, entropy = 0) {
    let color = '';
    let text = '';
    let width = Math.min(100, score) + '%';

    const styleEl = document.createElement('style');
    styleEl.id = 'dynamicStrengthStyle';
    const oldStyleEl = document.getElementById('dynamicStrengthStyle');
    if (oldStyleEl) oldStyleEl.remove();

    if (score === 0) {
        color = 'transparent';
        text = '';
        width = '0%';
    } else if (entropy < 40) {
        color = 'var(--danger)';
        text = 'Weak';
    } else if (entropy < 70) {
        color = 'var(--warning)';
        text = 'Medium';
    } else {
        color = 'var(--success)';
        text = 'Strong';
    }

    styleEl.innerHTML = `
        #strengthBar::after {
            width: ${width};
            background-color: ${color};
        }
        #strengthText {
            color: ${color};
        }
    `;
    document.head.appendChild(styleEl);
    strengthText.textContent = text;
}

function calculateTestStrength(password) {
    if (!password) {
        updateTestStrength(0, 0);
        if (testEntropyText) testEntropyText.textContent = '';
        return;
    }
    const entropy = Math.round(calculateEntropy(password, 'all'));
    if (testEntropyText) testEntropyText.textContent = `~${entropy} bits`;

    const score = Math.max(0, Math.min(100, (entropy / 90) * 100));
    updateTestStrength(score, entropy);
}

function updateTestStrength(score, entropy = 0) {
    let color = '';
    let text = '';
    let width = Math.min(100, score) + '%';

    const styleEl = document.createElement('style');
    styleEl.id = 'testDynamicStrengthStyle';
    const oldStyleEl = document.getElementById('testDynamicStrengthStyle');
    if (oldStyleEl) oldStyleEl.remove();

    if (score === 0) {
        color = 'transparent';
        text = '';
        width = '0%';
    } else if (entropy < 40) {
        color = 'var(--danger)';
        text = 'Weak';
    } else if (entropy < 70) {
        color = 'var(--warning)';
        text = 'Medium';
    } else {
        color = 'var(--success)';
        text = 'Strong';
    }

    styleEl.innerHTML = `
        #testStrengthBar::after {
            width: ${width};
            background-color: ${color};
        }
        #testStrengthText {
            color: ${color};
        }
    `;
    document.head.appendChild(styleEl);
    testStrengthText.textContent = text;
}


// =============== ENCRYPTED VAULT LOGIC (WEB CRYPTO API) ===============

let vaultKey = null;
let decryptedVault = [];
let pendingSaveMode = false;

async function deriveKey(password, salt) {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveBits", "deriveKey"]
    );
    return window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: enc.encode(salt),
            iterations: 200000, // Highly secure iteration count
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );
}

async function encryptData(text, key) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const encrypted = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        enc.encode(text)
    );

    const ivStr = btoa(String.fromCharCode(...iv));
    const cipherStr = btoa(String.fromCharCode(...new Uint8Array(encrypted)));
    return { iv: ivStr, data: cipherStr };
}

async function decryptData(encryptedObj, key) {
    try {
        const iv = new Uint8Array(atob(encryptedObj.iv).split('').map(c => c.charCodeAt(0)));
        const data = new Uint8Array(atob(encryptedObj.data).split('').map(c => c.charCodeAt(0)));

        const decrypted = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv: iv },
            key,
            data
        );
        const dec = new TextDecoder();
        return dec.decode(decrypted);
    } catch (e) {
        return null;
    }
}

async function saveVaultToStorage() {
    if (!vaultKey) return;
    const testEnc = await encryptData("vault-ok", vaultKey);
    const recordsEnc = await encryptData(JSON.stringify(decryptedVault), vaultKey);

    localStorage.setItem('enc_vault', JSON.stringify({
        test: testEnc,
        records: recordsEnc
    }));
}

// Vault Event Listeners

async function processPendingSaves() {
    return new Promise((resolve) => {
        if (!chrome || !chrome.storage || !chrome.storage.local) return resolve();
        chrome.storage.local.get(['pending_saves'], async (res) => {
            if (res.pending_saves && res.pending_saves.length > 0) {
                let added = false;
                res.pending_saves.forEach(item => {
                    if (!decryptedVault.find(v => v.password === item.password)) {
                        decryptedVault.push(item);
                        added = true;
                    }
                });
                if (added) {
                    await saveVaultToStorage();
                    showToast(`Auto-saved ${res.pending_saves.length} password(s)!`);
                }
                chrome.storage.local.remove('pending_saves');
            }
            resolve();
        });
    });
}

unlockVaultBtn.addEventListener('click', async () => {
    const pwd = masterPasswordInput.value;
    if (!pwd) return;

    unlockVaultBtn.textContent = 'Decrypting...';
    // Static salt used for local mock since it never leaves device
    const key = await deriveKey(pwd, 'vault-salt-x023');

    const vaultDataStr = localStorage.getItem('enc_vault');
    if (!vaultDataStr) {
        // Vault Setup
        vaultKey = key;
        decryptedVault = [];
        closeModals();
        showToast("Vault initialized successfully!");

        await processPendingSaves();

        if (pendingSaveMode) {
            autoSaveCurrentPassword();
            pendingSaveMode = false;
        }
        else openVault();

        unlockVaultBtn.textContent = 'Unlock';
        return;
    }

    try {
        const vaultData = JSON.parse(vaultDataStr);
        const testStr = await decryptData(vaultData.test, key);
        if (testStr !== 'vault-ok') throw new Error("Wrong password");

        vaultKey = key;
        const recordsStr = await decryptData(vaultData.records, key);
        decryptedVault = JSON.parse(recordsStr);

        masterPasswordInput.value = '';
        closeModals();
        showToast("Vault Unlocked");

        await processPendingSaves();

        if (pendingSaveMode) {
            autoSaveCurrentPassword();
            pendingSaveMode = false;
        }
        else openVault();

    } catch (e) {
        alert("Incorrect Master Password!");
    }
    unlockVaultBtn.textContent = 'Unlock';
});

function autoSaveCurrentPassword() {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            if (tabs && tabs[0] && tabs[0].url) {
                try {
                    let url = new URL(tabs[0].url);
                    saveNameInput.value = url.hostname || "Local File";
                    confirmSaveBtn.click();
                } catch(e) {
                    saveNameInput.value = '';
                    openModal(saveConfirmModal);
                }
            } else {
                saveNameInput.value = '';
                openModal(saveConfirmModal);
            }
        });
    } else {
        saveNameInput.value = '';
        openModal(saveConfirmModal);
    }
}

saveBtn.addEventListener('click', () => {
    if (!passwordText.value || passwordText.value === "Click 'Generate'") return;

    if (!vaultKey) {
        pendingSaveMode = true;
        masterPasswordInput.value = '';
        openModal(loginModal);
    } else {
        autoSaveCurrentPassword();
    }
});

confirmSaveBtn.addEventListener('click', async () => {
    const name = saveNameInput.value.trim() || 'Untitled';
    const pwd = passwordText.value;

    decryptedVault.push({
        id: Date.now().toString(),
        name,
        password: pwd,
        date: new Date().toLocaleDateString()
    });

    await saveVaultToStorage();
    closeModals();

    const originalHTML = saveBtn.innerHTML;
    saveBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    saveBtn.classList.add('saved');
    setTimeout(() => {
        saveBtn.innerHTML = originalHTML;
        saveBtn.classList.remove('saved');
    }, 2000);

    showToast(`Saved '${name}' to Vault!`);
});

openVaultBtn.addEventListener('click', () => {
    if (!vaultKey) {
        pendingSaveMode = false;
        masterPasswordInput.value = '';
        openModal(loginModal);
    } else {
        openVault();
    }
});

let vaultSearchTerm = '';

function openVault() {
    vaultSearchTerm = '';
    const searchInput = document.getElementById('vaultSearchInput');
    if (searchInput) searchInput.value = '';
    renderVaultItems();
    openModal(vaultModal);
}

const vaultSearchInput = document.getElementById('vaultSearchInput');
if (vaultSearchInput) {
    vaultSearchInput.addEventListener('input', (e) => {
        vaultSearchTerm = e.target.value;
        renderVaultItems();
    });
}

function renderVaultItems() {
    vaultList.innerHTML = '';

    const filtered = decryptedVault.filter(item => item.name.toLowerCase().includes(vaultSearchTerm.toLowerCase()));

    if (filtered.length === 0) {
        vaultList.innerHTML = `
            <div style="text-align:center; padding: 3rem 0; color:var(--text-secondary);">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 1rem; opacity: 0.5;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <p style="font-size: 1.1rem; font-weight: 500;">${decryptedVault.length === 0 ? "Your vault is empty." : "No passwords found."}</p>
            </div>
        `;
    } else {
        const sorted = [...filtered].sort((a, b) => b.id - a.id);

        sorted.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'vault-item';
            div.style.animation = `fadeInUp 0.3s ease forwards ${index * 0.05}s`;
            div.style.opacity = '0';
            
            div.innerHTML = `
                <div class="vault-item-info">
                    <strong>${item.name}</strong>
                    <span>••••••••••••</span>
                </div>
                <div class="vault-item-actions">
                    <button class="vault-act-btn" onclick="copyVaultItem('${item.password}')" title="Copy">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </button>
                    <button class="vault-act-btn delete-btn" onclick="deleteVaultItem('${item.id}')" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            `;
            vaultList.appendChild(div);
        });
    }
}

window.copyVaultItem = (pwd) => {
    navigator.clipboard.writeText(pwd).then(() => showToast("Password Copied!"));
};

window.deleteVaultItem = async (id) => {
    if (confirm("Permanently delete this saved password?")) {
        decryptedVault = decryptedVault.filter(i => i.id !== id);
        await saveVaultToStorage();
        openVault();
        showToast("Deleted forever.");
    }
};

lockVaultBtn.addEventListener('click', () => {
    vaultKey = null;
    decryptedVault = [];
    closeModals();
    showToast("Vault securely locked.");
});


// =============== UTILITIES ===============

function showToast(msg) {
    if (msg) toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

function updateSliderBackground() {
    const val = ((lengthSlider.value - lengthSlider.min) / (lengthSlider.max - lengthSlider.min)) * 100;
    lengthSlider.style.background = `linear-gradient(to right, var(--accent-primary) ${val}%, rgba(255, 255, 255, 0.1) ${val}%)`;
}

// 3D Tilt Effect removed

function openModal(modal) {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    modal.classList.add('active');
}

function closeModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
}

cancelLoginBtn.addEventListener('click', closeModals);
cancelSaveBtn.addEventListener('click', closeModals);
closeVaultBtn.addEventListener('click', closeModals);

// Initial setup
updateCheckboxState();
updateSliderBackground();
generatePassword();

// =============== APP TABS LOGIC ===============
const tabGen = document.getElementById('tabGen');
const tabHard = document.getElementById('tabHard');
const viewGenerator = document.getElementById('viewGenerator');
const viewHardener = document.getElementById('viewHardener');

if (tabGen && tabHard) {
    tabGen.addEventListener('click', () => {
        tabGen.classList.add('active');
        tabHard.classList.remove('active');
        viewGenerator.style.display = 'block';
        viewHardener.style.display = 'none';
    });

    tabHard.addEventListener('click', () => {
        tabHard.classList.add('active');
        tabGen.classList.remove('active');
        viewHardener.style.display = 'block';
        viewGenerator.style.display = 'none';
    });
}

// =============== HARDENING TOOL LOGIC ===============
const inputPwdHard = document.getElementById('inputPwd');
const toggleHardBtn = document.getElementById('toggleHardBtn');
const hardenBtn = document.getElementById('hardenBtn');
const resultsAreaHard = document.getElementById('resultsArea');
const timerTextHard = document.getElementById('timerText');

let clearTimerHard;
let countdownIntervalHard;

if (toggleHardBtn) {
    toggleHardBtn.addEventListener('click', () => togglePasswordVisibility(inputPwdHard, toggleHardBtn));
}

function randomizeCase(char) {
    if (/[a-zA-Z]/.test(char)) {
        return getSecureRandomValue(2) === 0 ? char.toLowerCase() : char.toUpperCase();
    }
    return char;
}

function hardenLeetspeak(pwd) {
    let res = "";
    const map = { 'a': '@', 'A': '@', 's': '$', 'S': '$', 'i': '1', 'I': '1', 'o': '0', 'O': '0', 'e': '3', 'E': '3' };
    for (let char of pwd) {
        if (map[char] && getSecureRandomValue(10) < 8) {
            res += map[char];
        } else {
            res += randomizeCase(char);
        }
    }
    let pad = "";
    const nums = "0123456789";
    for(let i=0; i<4; i++) pad += getRandomChar(nums);
    return res + "-" + pad;
}

function hardenInjection(pwd) {
    let res = "";
    const pool = "!@#$%^&*()_+~|}{[]:;?><,./-=" + "0123456789";
    for (let char of pwd) {
        res += randomizeCase(char);
        if (getSecureRandomValue(3) === 0) {
            res += getRandomChar(pool);
        }
    }
    if (res.length < 12) {
        while(res.length < 12) res += getRandomChar(pool);
    }
    return res;
}

function hardenMaximum(pwd) {
    let core = hardenLeetspeak(pwd);
    let prefix = "";
    let suffix = "";
    const pool = "!@#$%^&*()_+~|}{[]:;?><,./-=" + "0123456789" + "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for(let i=0; i<4; i++) prefix += getRandomChar(pool);
    for(let i=0; i<4; i++) suffix += getRandomChar(pool);
    return prefix + "_" + core + "_" + suffix;
}

if (hardenBtn) {
    hardenBtn.addEventListener('click', () => {
        const pwd = inputPwdHard.value;
        if (!pwd) return showToast("Please enter a password first.");

        const v1 = hardenLeetspeak(pwd);
        const v2 = hardenInjection(pwd);
        const v3 = hardenMaximum(pwd);

        updateHardDisplay('orig', pwd);
        updateHardDisplay('var1', v1);
        updateHardDisplay('var2', v2);
        updateHardDisplay('var3', v3);

        resultsAreaHard.classList.add('active');
        startHardTimer();
    });
}

function updateHardDisplay(idPrefix, pwd) {
    document.getElementById(idPrefix + 'Text').textContent = pwd;
    // We can reuse calculateEntropy here
    const ent = Math.round(calculateEntropy(pwd, 'all'));
    document.getElementById(idPrefix + 'Entropy').textContent = `(~${ent} bits)`;
    
    const badge = document.getElementById(idPrefix + 'Strength');
    if (ent < 40) {
        badge.textContent = 'Weak';
        badge.style.color = 'var(--danger)';
    } else if (ent < 70) {
        badge.textContent = 'Medium';
        badge.style.color = 'var(--warning)';
    } else {
        badge.textContent = 'Strong';
        badge.style.color = 'var(--success)';
    }
}

function startHardTimer() {
    clearTimeout(clearTimerHard);
    clearInterval(countdownIntervalHard);
    
    let timeLeft = 15;
    timerTextHard.textContent = `Clearing sensitive data in ${timeLeft} seconds...`;
    
    countdownIntervalHard = setInterval(() => {
        timeLeft--;
        timerTextHard.textContent = `Clearing sensitive data in ${timeLeft} seconds...`;
        if (timeLeft <= 0) {
            clearInterval(countdownIntervalHard);
            resultsAreaHard.classList.remove('active');
            inputPwdHard.value = '';
        }
    }, 1000);

    clearTimerHard = setTimeout(() => {
    }, 15000);
}

window.copyHardText = function(id, event) {
    const text = document.getElementById(id).textContent;
    navigator.clipboard.writeText(text).then(() => {
        showToast("Password Copied!");
        const btn = event.currentTarget;
        const origHTML = btn.innerHTML;
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        btn.style.color = 'var(--success)';
        setTimeout(() => {
            btn.innerHTML = origHTML;
            btn.style.color = '';
        }, 2000);
        
        startHardTimer();
    });
}

// =============== THEME TOGGLE LOGIC ===============
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIconSun = document.getElementById('themeIconSun');
const themeIconMoon = document.getElementById('themeIconMoon');
const themeIconAuto = document.getElementById('themeIconAuto');

let currentThemeMode = localStorage.getItem('theme') || 'auto';
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

function applyTheme(mode) {
    let isDark;
    
    if (mode === 'auto') {
        isDark = darkModeMediaQuery.matches;
        if (themeIconSun) themeIconSun.style.display = 'none';
        if (themeIconMoon) themeIconMoon.style.display = 'none';
        if (themeIconAuto) themeIconAuto.style.display = 'block';
    } else if (mode === 'dark') {
        isDark = true;
        if (themeIconSun) themeIconSun.style.display = 'none';
        if (themeIconMoon) themeIconMoon.style.display = 'block';
        if (themeIconAuto) themeIconAuto.style.display = 'none';
    } else {
        isDark = false;
        if (themeIconSun) themeIconSun.style.display = 'block';
        if (themeIconMoon) themeIconMoon.style.display = 'none';
        if (themeIconAuto) themeIconAuto.style.display = 'none';
    }

    if (isDark) {
        document.body.classList.remove('light-mode');
    } else {
        document.body.classList.add('light-mode');
    }
}

function setThemeMode(mode) {
    currentThemeMode = mode;
    localStorage.setItem('theme', mode);
    applyTheme(mode);
}

darkModeMediaQuery.addEventListener('change', () => {
    if (currentThemeMode === 'auto') {
        applyTheme('auto');
    }
});

applyTheme(currentThemeMode);

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        if (currentThemeMode === 'auto') {
            setThemeMode('light');
        } else if (currentThemeMode === 'light') {
            setThemeMode('dark');
        } else {
            setThemeMode('auto');
        }
    });
}
