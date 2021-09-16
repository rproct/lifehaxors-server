const roomList = [];

function createUser(id: string, username: string){
    const nUser = {
        id: id,
        name: username,
        question: "",
        itemList: [],
        answerList: [],
    }

    return nUser;
}

function generateRoom(){
    let code = '';
    for(let i = 0; i < 4; i++) {
        code += String.fromCharCode(Math.random() * (90 - 65) + 65);
    }

    return code;
}

export function createRoom(){
    let code;
    do {
        code = generateRoom();
    }while(roomList.find(element => element.room === code) !== undefined);

    roomList.push({room: code, players: []});

    return code;
}

export function joinRoom(id: string, name: string, room: string){
    let nUser = createUser(id, name);
    const index = roomList.findIndex(element => element.room === room);

    roomList[index].players.push(nUser);

    return nUser;
}

export function isRoomFull(room: string){
    const index = roomList.findIndex(element => element.room === room);
    const capacity = roomList[index].players.length;

    return capacity >= 8 || capacity === 0;
}