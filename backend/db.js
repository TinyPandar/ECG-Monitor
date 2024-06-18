const UID = 'user_id';
const UNAME = 'username';
const PWD = 'password';
const TABLEUSER = 'credentials';
const TABLEINFO = 'personal_info';
const INFOATTRIBUTES = 'user_id, name, gender, height, weight, age, blood_type, city, picture';
const TABLEARCHIVE = 'archives';
const ARCHIVEATTRIBUTES = 'user_id, date, disease, medicine, hospital, doctor';
const TABLEABNORMAL='abnormal_signals';
const ABNORMALATTRIBUTES='user_id, signals, url, label';

const mysql2 = require("mysql2/promise");

const pool = mysql2.createPool({
    host: "localhost",
    user: "root",
    password: "12345678",
    database: "ecg",
});

async function auth(username, password) {
    try{
    const [results, fields] = await pool.query(
        `select ${UID}, ${PWD} from ${TABLEUSER} where ${UNAME}=?`,
        username
    );
    if (results.length > 0 && results[0][PWD] === password) {
        console.log("auth successed with user: " + username);
        return results[0][UID];
    } else {
        console.log("auth failed with result:");
        console.log(results);
        return null;
    }
}catch{
    return null;
}
}

async function isUserExists(username) {
    try{
    const [results, fields] = await pool.query(
        `select ${UID} from ${TABLEUSER} where ${UNAME}=?`,
        username
    );
    if (results.length > 0) {
        return true;
    } else {
        return false;
    }
}catch{
    return false;
}
}

async function addUser(username, password) {
    try{
    const [results, fields] = await pool.query(
        `insert into ${TABLEUSER}(${UNAME}, ${PWD}) value(?, ?)`,
        [username, password]
    );
    if (results.affectedRows > 0) {
        console.log("added user: " + results);
        return true;
    } else {
        return false;
    }
}catch{
    return false;
}
}

async function changePassword(username, password) {
    try{
    const [results, fields] = await pool.query(
        `update ${TABLEUSER} set ${PWD}=? where ${UNAME}=?`,
        [password, username]
    );
    if (results.affectedRows>0){
        console.log('updated password');
        return true;
    }else{
        return false;
    }
}catch{
    return false;
}
}

async function getInfo(id) {
    try{
    const [results, fields] = await pool.query(
        `select * from ${TABLEINFO} where ${UID}=?`,
        id
    );
    if (results.length > 0) {
        console.log("return info of user: " + id);
        return results[0];
    } else {
        console.log("failed to get info:" + id);
        return null;
    }
}catch{
    return null;
}
}

async function addInfo(id, info) {
    try{
    const [results, fields] = await pool.query(
        `insert into ${TABLEINFO}(${INFOATTRIBUTES}) value(?,?,?,?,?,?,?,?,?)`,
        [id, info.name, info.gender, info.height, info.weight, info.age, info.blood_type, info.city, info.picture]
    );
    if (results.affectedRows > 0) {
        console.log("added info of user: " + id);
        return true;
    } else {
        return false;
    }
}catch{
    return false;
}
}

async function changeInfo(id, info) {
    try{
    // Hardcoded
    const [results, fields] = await pool.query(
        `update ${TABLEINFO} set name=?, gender=?, height=?, weight=?, age=?, blood_type=?, city=?, picture=? where ${UID}=?`,
        [info.name, info.gender, info.height, info.weight, info.age, info.blood_type, info.city, info.picture, id]
    );
    if (results.affectedRows>0){
        console.log('updated info of user: '+id);
        return true;
    }else{
        return false;
    }
}catch{
    return false;
}
}

async function addArchive(id, archive) {
    try{
    const [results, fields] = await pool.query(
        `insert into ${TABLEARCHIVE}(${ARCHIVEATTRIBUTES}) value(?,?,?,?,?,?)`,
        [id, archive.date, archive.disease, archive.medicine, archive.hospital, archive.doctor]
    );
    if (results.affectedRows > 0) {
        console.log("added archive of user: " + id);
        return true;
    } else {
        return false;
    }
}catch{
    return false;
}

}

async function getArchive(id) {
    try{
    const [results, fields] = await pool.query(
        `select * from ${TABLEARCHIVE} where ${UID}=?`,
        id
    );
    if (results.length > 0) {
        console.log("return archive of user: " + id);
        return results;
    } else {
        console.log("failed to get archive:" + id);
        return null;
    }
}catch{
    return null;
}
}

async function changeArchive(id, archive) {
    try{
    // Hardcoded
    const [results, fields] = await pool.query(
        `update ${TABLEARCHIVE} set date=?, disease=?, medicine=?, hospital=?, doctor=? where archive_id=?`,
        [archive.date, archive.disease, archive.medicine, archive.hospital, archive.doctor, id]
    );
    if (results.affectedRows>0){
        console.log('updated archive of user: '+id);
        return true;
    }else{
        return false;
    }
}catch{
    return false;
}
}

async function saveAbnormal(user_id, signal, url, label) {
    const [results, fields] = await pool.query(
        `select * from ${TABLEABNORMAL} where ${UID}=?`,
        user_id
    );
    if (results.length > 10) {
        console.log("abnormal_signals reached limit of user: "+user_id);
        return false;
    }
    try{
        const [results, fields] = await pool.query(
            `insert into ${TABLEABNORMAL}(${ABNORMALATTRIBUTES}) values (?,?,?,?)`,
            [user_id, [JSON.stringify(signal)], url, label]
        );
        if (results.affectedRows > 0) {
            console.log("added abnormal of user: " + user_id);
            return true;
        } else {
            return false;
        }
    }catch{
        return false;
    }
}

async function getAbnormal() {
    try{
        const [results, fields] = await pool.query(
            `select * from ${TABLEABNORMAL}`
        );
        if (results.length > 0) {
            console.log("return abnormal_signals");
            return results;
        } else {
            return null;
        }
    }catch{
        return null;
    }
}

async function getUserAbnormal(user_id) {
    try{
        const [results, fields] = await pool.query(
            `select * from ${TABLEABNORMAL} where ${UID}=?`,
            user_id
        );
        if (results.length > 0) {
            console.log("return abnormal_signals of user:"+user_id);
            return results;
        } else {
            return null;
        }
    }catch{
        return null;
    }
}

async function commentAbnormal(abnormal_id, comment) {
    try{
        // Hardcoded
        const [results, fields] = await pool.query(
            `update ${TABLEABNORMAL} set comment=? where abnormal_id=?`,
            [comment, abnormal_id]
        );
        if (results.affectedRows>0){
            console.log('updated comment of abnormal: '+abnormal_id);
            return true;
        }else{
            return false;
        }
    }catch{
        return false;
    }
}

async function getAbnormalNoComment(){
    // try{
        const [results, fields] = await pool.query(
            `select * from ${TABLEABNORMAL} where comment is null`
        );
        if (results.length > 0) {
            console.log("return abnormal_signals");
            return results;
        } else {
            return null;
        }
    // }catch{
    //     return null;
    // }
}

module.exports = {auth, isUserExists, addUser, changePassword, getInfo, addInfo, changeInfo, addArchive, getArchive, changeArchive, saveAbnormal, getAbnormal, getUserAbnormal, commentAbnormal, getAbnormalNoComment}