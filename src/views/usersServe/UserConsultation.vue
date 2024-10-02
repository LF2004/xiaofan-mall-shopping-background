<template>
  <div class="Consultation-wrapper">
    <div class="user-info-list">
      <div class="user-info-list-header">
        <div class="user-info-list-header-tab">
          <ul class="user-info-list-header-tab-ul">
            <span>|</span>
            <li :class="selectTabIndex === index ? 'user-info-list-header-tab-select' :'' "
                v-for="item,index in headerListTab" @click="changAllSelectOrWeiDu(index)">
              {{ item.title }}
            </li>
          </ul>

          <div class="shaixuan">筛选</div>
        </div>
      </div>

      <div class="user_list">
        <div class="msg-user-item" :class="selectUserIndex === index ? 'msg-user-select' : ''"
             v-for="item,index in onlineUserList"
             @click="changSelectUser(item.uid,index)">
          <div class="user-info-wrap">
            <div class="user-info__avatar"  v-if="item.uid !== 'root'">
              <img :src="item.avatar"
                   v-if="onlineUserList"
                   class="user-info__avatar_img" >
              <span class="red_dot" v-if="userMsgCount[item.uid]"><em class="weui-desktop-badge_with-content">{{userMsgCount[item.uid]}}</em></span>
            </div>
            <div class="user-info__left"><span class="user-info__name"  v-if="onlineUserList">{{ item.NickName }}</span> <span
                class="user-info__filter"><span></span> </span></div>
            <div class="user-info__right"><span class="user-info__time">13:50</span></div>
          </div>
          <div class="msg-item-con">
            <div class="msg-item-data">
              <div class="user-msg-media user-msg-text in-msg-user is-my-msg" v-if="latestMsgs[item.uid]?.connent">
                {{ latestMsgs[item.uid]?.connent }}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="user-chat-panel">
      <div class="user-info">
        <div class="user-info-left">
          <div class="weui-desktop-popover__wrp"><span class="weui-desktop-popover__target"><div
              class="user-info__buddy-card-target">
            <img
              :src="(selectUserInfo?.avatar ? selectUserInfo?.avatar : onlineUserList[0].avatar)"
              class="user-info__avatar" v-if="selectUserInfo"> <span class="user-right-title-name"  v-if="selectUserInfo">{{ (selectUserInfo?.NickName ? selectUserInfo?.NickName : onlineUserList[0].NickName) }}</span></div></span>
            <div class="weui-desktop-popover weui-desktop-popover_pos-up-left rich_buddy" style="display: none;">
              <div class="weui-desktop-popover__inner"><!---->
                <div class="weui-desktop-popover__desc">
                  <div class="buddy-card_area is-wechat-user">
                    <div class="buddy-card_box loading"><span class="vm_box"></span> <i
                        class="icon_loading_small white"></i></div> <!----> <!----></div>
                </div> <!----></div>
            </div>
          </div>
        </div>
        <div class="user-info-right">
          <h3 style="cursor: pointer">...</h3>
        </div>
      </div>

      <div class="chat-msg-list" ref="messageContainer">
        <div v-for="item,index in chatMsgList" :class="item.uid === 'root' ? 'is-my-msg-sty' : ''">
<!--          <p class="chat-item-time">2-11 20:49</p>-->
          <div class="chat-msg-item">
            <div class="msg-item">
              <div class="user-msg-media user-msg-text in-msg-chat" v-if="item.uid == selectUserInfo.uid || selectUserInfo.uid === item.sendToUid ">{{ item.connent }}</div>
              <div class="send-time"  v-if="item.uid == selectUserInfo.uid || selectUserInfo.uid === item.sendToUid ">{{ item.sendTime }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="chat-msg-sender" id="input-container">
        <textarea autoHeight="true" v-model="sendContent" placeholder="发个消息聊聊呗~" maxlength="1024"
                  class="chat-mb-sty"></textarea>
        <button class="sendMsg" @click="sendMsg">发送</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// @ts-nocheck
import VueSocketIO from 'vue-socket.io';
import axios from "axios";
import {ref,onMounted,computed} from 'vue';
const baseUrl = 'http://193.112.123.10';

const createSocketIO = ref('')
const createSocketEmitter = ref(null);
const selectTabIndex = ref(0);

const selectUserIndex = ref(0);
const sendContent = ref('')
const headerListTab = ref([

  {
    title: '全部'
  },
  {
    title: '未读'
  }
])

const onlineUserList = ref([])

const chatMsgList = ref([]);

const selectUserInfo = ref();

const userMsgCount = ref({});

const latestMsgs = ref({}); // 保存不同用户的最新消息

const changAllSelectOrWeiDu = (index: number) => {
  selectTabIndex.value = index;
}

const changSelectUser = (uid:string,index: number) => {
  selectUserIndex.value = index;
  selectUserInfo.value = onlineUserList.value.find(v => v.uid === uid);

  userMsgCount.value[uid] = 0;
}

const getCurrenTime = ()=>{
  const time = new Date()
  const y = time.getFullYear();
  const m = time.getMonth() + 1;
  const d = time.getDay()
  return y.toString() + '-' + m.toString() + '-' + d.toString()
}

const messageContainer = ref(null);


const scrollMessageContainerToBottom = () => {
  if (messageContainer.value) {
    const inputContainer = document.getElementById('input-container'); // 假设输入框容器的id为input-container
    if (inputContainer) {
      inputContainer.scrollIntoView({ behavior: "smooth", block: "end" }); // 将输入框容器滚动到可视区域以下
    }

    setTimeout(() => {
      const scrollHeight = messageContainer.value.scrollHeight;
      messageContainer.value.scrollTop = scrollHeight;
    }, 100); // 等待滚动完成后再滚动到最底部
  }
};





const sendMsg = ()=>{
  let sendItemMsg = {
    Uid: 'root',
    content: sendContent.value,
    sendToUid:selectUserInfo.value.uid,
    avatar: 'https://img2.imgtp.com/2024/03/09/ob7LioHu.png',
    type: 0,
    sendTime: getCurrenTime() + " " + Date().split(" ")[4]
  }
  createSocketIO.value.emit('message',sendItemMsg)
  axios.post(`${baseUrl}:4000/sendMsg`,{
    uid:selectUserInfo.value.socketId,
    sendToUid:selectUserInfo.uid,
    msg:sendContent.value
  }).then((res) =>{
    console.log(res.data.msg)
  })

  sendContent.value = ''
  scrollMessageContainerToBottom()
}

onMounted(() =>{
  const createSocketItem = new VueSocketIO({
    debug: true,
    options: {
      autoConnect: false, //默认关闭，创建后打开，组件内使用可直接打开，就不需要用io.open()
      transports: ['websocket'],
      query: {
        uid: 'root' //携带的额外参数也可通过url拼接实现
      }
    },
    connection: `${baseUrl}:8900`
  })
  const {
    io,
    emitter
  } = createSocketItem

  io.open()
  createSocketIO.value = io;
  createSocketEmitter.value = emitter

  io.on('connecting', () => {
    console.log('正在连接---888')
  })
  io.on('connect', () => {
    console.log('连接成功---888')
  })

  try {
    createSocketEmitter.value.addListener('getUserList', (data) => {
     onlineUserList.value = data;
      selectUserInfo.value = data[0]
    });

  } catch (error) {
    console.error('Error occurred while retrieving data:', error);
  }



  try {
    createSocketEmitter.value.addListener('getUserChatList', (data) => {
      // 用对象来存储每个用户的消息数量
      userMsgCount.value = {};
      data.forEach((v) => {
        if (v.uid !== 'root') {
          if (userMsgCount.value[v.uid]) {
            userMsgCount.value[v.uid] += 1; // 如果用户已存在，消息数量加一
          } else {
            userMsgCount.value[v.uid] = 1; // 如果用户不存在，初始化消息数量为1
          }
        }
      });

      // 输出每个用户发送的消息数量
      for (const userId in userMsgCount.value) {
        console.log(`用户 ${userId} 发送了 ${userMsgCount.value[userId]} 条消息`);
      }

      // 保存不同用户的最新消息
      data.forEach((msg) => {
        if (msg.uid !== 'root') {
          latestMsgs.value[msg.uid] = msg;
        }
      });

      chatMsgList.value = data;
      scrollMessageContainerToBottom();
    });


  } catch (error) {
    console.error('Error occurred while retrieving data:', error);
  }



})
</script>

<style lang="scss">
textarea{
  border:none;
  outline: none;
  resize: none;
  background:none;
}
.chat-mb-sty{
  width: 100%;
  height: 100%;
  padding-top: 20px;
  font-size: 18px;
}
.sendMsg{
  position: absolute;
  right: 5%;
  bottom: 5%;
  cursor: pointer;
  width: 80px;
  height: 40px;
  line-height: 40px;
  background-color: #409eff;
  color: #ffffff;
  border-radius: 25px;
  text-align: center;
  border: none;
}
.user-info-list-header-tab-select {
  color: #409eff;
}

.shaixuan {
  position: absolute;
  width: 50px;
  top: 10px;
  left: 250%;
  color: #576b95;
}

.user-msg-media.user-msg-text.in-msg-user, .user-msg-media.user-msg-other.in-msg-user {
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.Consultation-wrapper {
  width: 80%;
  height: 550px;
  margin: 50px auto;
  display: flex;
  box-shadow: 2px 5px 10px 0px rgba(0, 0, 0, 0.3);

  .user-info-list {
    width: 40%;
    height: 100%;
    background-color: #ffffff;
    border-radius: 10px 0 0 10px;
    border-right: 1px solid #e3e4e5;

    .user-info-list-header {

      width: 80%;
      height: 60px;
      margin: 0 auto;

      .user-info-list-header-tab {
        cursor: pointer;
        width: 120px;
        height: 40px;
        border-radius: 20px;
        transform: translateY(10px);
        background-color: #f6f7f8;

        .user-info-list-header-tab-ul {
          span {
            position: relative;
            left: 50%;
            color: #e3e4e5;
            font-size: 12px;
          }

          display: flex;
          line-height: 40px;

          li {
            font-size: 14px;
            margin-left: 20px;
          }

        }
      }
    }

    .user_list {
      position: relative;
      height: calc(100% - 80px);
      overflow-y: auto;

      .msg-user-select {
        border-left: 2px solid #409eff;
        background-color: #f6f7f8;
      }

      .msg-user-item {

        cursor: pointer;
        position: relative;
        padding: 16px 24px 16px 74px;
        min-height: 40px;

        .user-info-wrap {

          display: flex;
          justify-content: space-between;
          height: 20px;
          line-height: 20px;
          margin-bottom: -2px;

          .user-info__avatar {

            position: absolute;
            top: 16px;
            left: 22px;
            height: 40px;
            width: 40px;

            .user-info__avatar_img {
              width: 40px;
              height: 40px;
              border-radius: 4px;
            }

            .red_dot {
              position: absolute;
              top: 0;
              right: 0;
              transform: translate(50%, -50%);

              .weui-desktop-badge_with-content {
                display: inline-block;
                background-color: #fa5151;
                border-radius: 10px;
                min-width: 20px;
                line-height: 20px;
                font-style: normal;
                color: #fff;
                font-size: 12px;
                font-weight: 400;
                font-family: PingFang SC;
                padding: 0 4px;
                text-align: center;
              }
            }
          }

          .user-info__left {
            width: 0;
            flex-grow: 1;
            display: inline-flex;

            .user-info__name {
              font-size: 12px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              flex-shrink: 1;
              color: #7e8081;
            }
          }

          .user-info__time {
            font-size: 12px;
            color: #b1b2b3;
          }
        }
      }
    }
  }


  .user-chat-panel {
    width: 60%;
    height: 100%;
    background-color: #ffffff;
    border-radius: 0 10px 10px 0;

    .user-info {

      display: flex;
      justify-content: space-between;
      height: 60px;
      padding: 16px 24px;
      border-bottom: 1px solid #e3e4e5;

      .user-info__avatar {
        height: 32px;
        width: 32px;
        border-radius: 4px;
      }

    }
    .chat-msg-list::-webkit-scrollbar{
      width: 5px;
      background-color: #409eff;
    }
    .chat-msg-list::-webkit-scrollbar-track
    {
      background-color:#F5F5F5;
    }
    .chat-msg-list::-webkit-scrollbar-thumb
    {

      background-color:#555;
    }
    .chat-msg-list {
      height: 400px;
      flex-grow: 10;
      padding: 8px 24px;
      overflow-y: auto;

      .chat-item-time {
        margin: 24px 0 16px 0;
        color: #b1b2b3;
        text-align: center;
      }

      .chat-msg-item {
        margin: 16px 0;

        .msg-item {
          display: flex;
          align-items: center;

          .send-time {
            margin-left: 20px;
            color: #b1b2b3;
            font-size: 14px;
          }
        }

        .user-msg-media.user-msg-text.in-msg-chat, .user-msg-media.user-msg-other.in-msg-chat {
          display: inline;
          white-space: pre-line;
          max-width: 67%;
          padding: 12px;
          border-radius: 4px;
          width: -webkit-fit-content;
          width: -moz-fit-content;
          width: fit-content;
          background-color: #f6f7f8;
        }
      }
    }

    .chat-msg-sender {
      width: 99%;
      position: relative;
      padding: 0 24px 24px 24px;
      border-top: 1px solid #e3e4e5;
      background-color: #ffffff;
    }

  }

}

.is-my-msg-sty {
  display: flex;
  justify-content: flex-end;
}


.user-right-title-name {
  width: 300px;
  position: relative;
  top: -30px;
  left: 20%;
  color: #1a1b1c;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
</style>
