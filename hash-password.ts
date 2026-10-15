// hash-password.ts
import * as bcrypt from 'bcrypt';

const password = '123456'; // la contraseña que quieras hashear
const saltRounds = 10;

const hash = bcrypt.hashSync(password, saltRounds);
console.log('Hash generado:', hash);
