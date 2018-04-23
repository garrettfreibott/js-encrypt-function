#!/usr/bin/env node

const AES = require('crypto-js/aes')
const prompt = require('prompt')
const fs = require('fs')

const filename = process.argv[2]
if (!filename) {
    console.log('usage: encrypt-func <file>')
    process.exit(1);
}

const encFilename = filename + '.encrypted.js'

prompt.get([{
    name: 'password',
    hidden: true
}], (err, result) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    fs.readFile(filename, 'utf8', (err, data) => {
        if (err){
            console.log(err)
            process.exit(1);
        }
    
        const writeData = 'module.exports = ' + JSON.stringify(String(AES.encrypt(data, result.password)))
        fs.writeFile(encFilename, writeData, 'utf8', (err) => {
            if (err){
                console.log(err)
                process.exit(1);
            }
            console.log(`Encrypted file: ${encFilename}
            Code needed:
            const CryptoJS = require('crypto-js')
            const encryptedFunction = require('./${encFilename}')

            const pass = <Prompt_user_for_password>
            const decryptedFunction = new Function(CryptoJS.AES.decrypt(encryptedFunction, pass).toString(CryptoJS.enc.Utf8))
            `)
        })
    })
})