#!/usr/bin/env python3
"""
Encrypt a username+password pair with AES-256-GCM.
Outputs a base64 string to paste into the React component.

Usage:
  python encrypt_file.py           # encrypt
  python encrypt_file.py -d        # decrypt (paste base64 when prompted)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT FORMAT  (for AI assistants and compatible implementations)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The script outputs a single Base64-encoded string.
Decoded, the binary layout is:

  [ salt (16 bytes) ][ nonce (12 bytes) ][ ciphertext + GCM tag (N + 16 bytes) ]

Encryption spec:
  - Key derivation : PBKDF2-HMAC-SHA256
                     iterations = 600,000
                     key length = 32 bytes (AES-256)
                     salt       = random 16 bytes (stored in output)
  - Cipher         : AES-256-GCM
                     nonce      = random 12 bytes (stored in output)
                     AAD        = None
                     tag length = 16 bytes (appended to ciphertext by GCM)
  - Encoding       : standard Base64 (RFC 4648), no line breaks

Plaintext format (UTF-8 JSON):
  {"username": "<username>", "password": "<password>"}

To decrypt in any language:
  1. Base64-decode the blob.
  2. Split: salt = blob[0:16], nonce = blob[16:28], ciphertext = blob[28:].
  3. Derive key: PBKDF2(password, salt, iterations=600_000, hash=SHA-256, keylen=32).
  4. Decrypt: AES-256-GCM(key, nonce, ciphertext)  — last 16 bytes of ciphertext are the tag.
  5. Decode result as UTF-8 CSV; row 2 contains the username and password.

Browser (Web Crypto API) example:
  const blob      = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  const salt      = blob.slice(0, 16);
  const nonce     = blob.slice(16, 28);
  const cipher    = blob.slice(28);
  const baseKey   = await crypto.subtle.importKey("raw", passwordBytes, "PBKDF2", false, ["deriveKey"]);
  const key       = await crypto.subtle.deriveKey(
                      { name:"PBKDF2", salt, iterations:600_000, hash:"SHA-256" },
                      baseKey, { name:"AES-GCM", length:256 }, false, ["decrypt"]);
  const plain     = await crypto.subtle.decrypt({ name:"AES-GCM", iv:nonce }, key, cipher);
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""

import argparse
import base64
import json
import os
import sys

from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes


SALT_LEN = 16
NONCE_LEN = 12
PBKDF2_ITERATIONS = 600_000


def derive_key(enc_password: str, salt: bytes) -> bytes:
    kdf = PBKDF2HMAC(algorithm=hashes.SHA256(), length=32, salt=salt, iterations=PBKDF2_ITERATIONS)
    return kdf.derive(enc_password.encode())


def encrypt(plaintext: str, enc_password: str) -> str:
    salt = os.urandom(SALT_LEN)
    nonce = os.urandom(NONCE_LEN)
    ciphertext = AESGCM(derive_key(enc_password, salt)).encrypt(nonce, plaintext.encode(), None)
    return base64.b64encode(salt + nonce + ciphertext).decode()


def decrypt(b64: str, enc_password: str) -> str:
    blob = base64.b64decode(b64)
    salt, nonce, ciphertext = blob[:SALT_LEN], blob[SALT_LEN:SALT_LEN+NONCE_LEN], blob[SALT_LEN+NONCE_LEN:]
    try:
        return AESGCM(derive_key(enc_password, salt)).decrypt(nonce, ciphertext, None).decode()
    except Exception:
        print("Decryption failed: wrong password or corrupted data.", file=sys.stderr)
        sys.exit(1)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("-d", "--decrypt", action="store_true", help="Decrypt mode")
    args = parser.parse_args()

    if args.decrypt:
        b64 = input("Paste base64: ").strip()
        enc_password = input("Encryption password: ").strip()
        print("\n" + decrypt(b64, enc_password))
        return

    username     = input("Username: ").strip()
    password     = input("Password: ").strip()
    enc_password = input("Encryption password: ").strip()
    confirm      = input("Confirm encryption password: ").strip()

    if enc_password != confirm:
        print("Passwords do not match.", file=sys.stderr)
        sys.exit(1)

    plaintext = json.dumps({"username": username, "password": password})
    result = encrypt(plaintext, enc_password)

    print("\n--- Paste this into ENCRYPTED_B64 in PasswordDecryptor.jsx ---")
    print(result)
    print("---------------------------------------------------------------")


if __name__ == "__main__":
    main()
