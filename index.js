const inquirer = require('inquirer') //npm install --save inquirer@^8.0.0
const chalk = require('chalk'); //npm install --save chalk@^4.1.2

const fs = require('fs')

operation()

function operation() {
    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'O que você deseja fazer?',
        choices: [
            'Criar conta',
            'Consultar saldo',
            'Depositar',
            'Sacar',
            'Excluir conta',
            'Sair'
        ],
    }]).then((answer) => {
        const action = answer['action']

        switch(action) {
            case 'Criar conta':
                createAccount();
                break; 
            case 'Consultar saldo':
                getAccountBalence()
                break;
            case 'Depositar':
                deposit()
                break;
            case 'Sacar':
                widthDraw()
                break;
            case 'Excluir conta':
                deleteAccount()
                break;
            case 'Sair':
                console.log(chalk.bgBlue.black('Obrigado por usar o Accounts!\n'))
                process.exit()
                
        }

    }).catch((err) => console.log(err))
}

function createAccount() {
    console.log(chalk.bgGreen.black('Obrigado por escolher o nosso banco!\n'))
    console.log(chalk.green('Defina as opções da sua conta a seguir\n'))

    buildAccount()
}

function buildAccount() {
    inquirer.prompt([{
        name: 'accountName',
        message: 'Digite um nome para a sua conta'
    }]).then((answer) => {
        const accountName = answer['accountName']

        console.info(accountName)

        if(!fs.existsSync('accounts')) {
            fs.mkdirSync('accounts')
        }

        if(fs.existsSync(`accounts/${accountName}.json`)) {
            console.log(chalk.bgRed.black('Está conta já existe, escolha outro nome!\n'))

            buildAccount()
            return
        }

        fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 0}', function(err) {
            console.log(err)
        })

        console.log(chalk.green("Conta criada com sucesso!\n"))
        operation()

    }).catch(err => console.log(err))
}

function deposit() {
     inquirer.prompt([{
        name: 'accountName',
        message: 'Qual o nome da sua conta?'
     }]).then((answer) => {
        const accountName = answer['accountName']

        if(!checkAccount(accountName)) {
            return deposit()
        }

        inquirer.prompt([{
            name: 'amount',
            message: 'Quanto você deseja depositar?'
        }]).then((answer) => {
            const amount = answer['amount']

            addamount(accountName, amount)

        }).catch(err => console.log(err))

     }).catch(err => console.log(err))
}

function checkAccount (accountName) {
    if(!fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.bold('Está conta não existe, escolha outro nome!\n'))
        return false
    }
    return true
}

function addamount (accountName, amount) {
    const accountData = getAccount(accountName)
    amount = parseFloat(amount)

    if(!amount || !typeof amount === 'number') {
        console.log(chalk.bgRed.bold('Digite um valor válido!\n'))
        return deposit()
    }

    accountData.balance = amount + parseFloat(accountData.balance)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        }
    )
    console.log(chalk.green(`O valor de ${amount} foi depositado com sucesso!\n`))
    operation()
}

function getAccount (accountName) {
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf8',
        flag: 'r'
    })
    return JSON.parse(accountJSON)
}

function getAccountBalence() {
    inquirer.prompt([{
        name: 'accountName',
        message: 'QUal o nome da sua conta?'
    }]).then((answer) => {
        const accountName = answer['accountName']

        if(!checkAccount(accountName)) {
            return getAccountBalence()
        }

        const accountData = getAccount(accountName)
        console.log(chalk.bgBlue.black(`O saldo da sua conta é de: R$${accountData.balance}\n`))

        operation()
    }).catch(err => console.log(err))
}

function widthDraw() {
    inquirer.prompt([{
        name: 'accountName',
        message: 'Qual o nome da sua conta?'
    }]).then((answer) => {
        const accountName = answer['accountName']

        if(!checkAccount(accountName)) {
            return widthDraw()
        }

        inquirer.prompt([{
            name: 'amount',
            message: 'Quanto você deseja sacar?'
        }]).then((answer) => {
            const amount = answer['amount']

            removeAmount(accountName, amount)

        }).catch(err => console.log(err))

    }).catch(err => console.log(err))
}

function removeAmount(accountName, amount) {
    const accountData = getAccount(accountName)
    amount = parseFloat(amount)

    if(!amount || !typeof amount === 'number') {
        console.log(chalk.bgRed.black('Digite um valor válido\n'))
        return widthDraw()
    }

    if(accountData.balance < amount) {
        console.log(chalk.bgRed.black('Saldo insuficiente!\n'))
        return widthDraw()
    }

    accountData.balance = parseFloat(accountData.balance) - amount

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        }
    )
    console.log(chalk.green(`Saque de R$${amount} realizado com sucesso!\n`))
    return operation()
}

function deleteAccount() {
    inquirer.prompt([{
        name: 'accountName',
        message: 'Digite o nome da sua conta'
    }]).then((answer) => {
        const accountName = answer['accountName']

        if(!fs.existsSync(`accounts/${accountName}.json`)) {
            console.log(chalk.bgRed.bold('Conta não encontrada!\n'))
            return operation()
        }

        fs.unlink(`accounts/${accountName}.json`, function (err) {
            if (err) {
                console.log(err)
                return
            }

            console.log(chalk.green('Conta excluída com sucesso!\n'))
            return operation()
        })

        }).catch(err => console.log(err))
}