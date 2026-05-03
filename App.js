import "./global.css";
import { useMemo, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const me = {
  id: "me",
  name: "You",
};

const initialThreads = [
  {
    id: "maya",
    name: "Maya Chen",
    route: "Taipei Main Station -> Xinyi",
    online: true,
    unread: 2,
    messages: [
      {
        id: "m1",
        senderId: "maya",
        text: "Hi, are you still driving to Xinyi at 8:30?",
        time: "8:02 AM",
      },
      {
        id: "m2",
        senderId: "maya",
        text: "I can meet at exit M5 if that works.",
        time: "8:04 AM",
      },
    ],
  },
  {
    id: "leo",
    name: "Leo Wang",
    route: "Banqiao -> Neihu",
    online: false,
    unread: 0,
    messages: [
      {
        id: "l1",
        senderId: "me",
        text: "I have two seats open tomorrow morning.",
        time: "Yesterday",
      },
      {
        id: "l2",
        senderId: "leo",
        text: "Thanks. I will confirm after work.",
        time: "Yesterday",
      },
    ],
  },
  {
    id: "nina",
    name: "Nina Lin",
    route: "Taoyuan -> Nangang",
    online: true,
    unread: 1,
    messages: [
      {
        id: "n1",
        senderId: "nina",
        text: "Can I join the Friday carpool?",
        time: "7:18 AM",
      },
    ],
  },
];

function getTimeLabel() {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());
}

function Avatar({ name, online }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <View className="relative h-12 w-12 items-center justify-center rounded-full bg-emerald-700">
      <Text className="text-base font-bold text-white">{initials}</Text>
      <View
        className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${
          online ? "bg-emerald-400" : "bg-gray-300"
        }`}
      />
    </View>
  );
}

function ThreadRow({ thread, active, onPress }) {
  const lastMessage = thread.messages[thread.messages.length - 1];

  return (
    <Pressable
      onPress={onPress}
      className={`mb-3 rounded-lg border p-4 ${
        active ? "border-emerald-700 bg-emerald-50" : "border-gray-200 bg-white"
      }`}
    >
      <View className="flex-row items-center gap-3">
        <Avatar name={thread.name} online={thread.online} />
        <View className="min-w-0 flex-1">
          <View className="flex-row items-center justify-between gap-3">
            <Text className="flex-1 text-base font-bold text-gray-950" numberOfLines={1}>
              {thread.name}
            </Text>
            {thread.unread > 0 ? (
              <View className="min-w-6 items-center rounded-full bg-emerald-700 px-2 py-0.5">
                <Text className="text-xs font-bold text-white">{thread.unread}</Text>
              </View>
            ) : null}
          </View>
          <Text className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
            {thread.route}
          </Text>
          <Text className="mt-2 text-sm text-gray-600" numberOfLines={1}>
            {lastMessage.text}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function MessageBubble({ message }) {
  const own = message.senderId === me.id;

  return (
    <View className={`mb-3 flex-row ${own ? "justify-end" : "justify-start"}`}>
      <View
        className={`max-w-[82%] rounded-lg px-4 py-3 ${
          own ? "bg-emerald-700" : "bg-white"
        }`}
      >
        <Text className={`text-base leading-5 ${own ? "text-white" : "text-gray-950"}`}>
          {message.text}
        </Text>
        <Text className={`mt-1 text-xs ${own ? "text-emerald-100" : "text-gray-500"}`}>
          {message.time}
        </Text>
      </View>
    </View>
  );
}

function NotificationItem({ item }) {
  return (
    <View className="mb-3 rounded-lg border border-gray-200 bg-white p-4">
      <Text className="text-sm font-bold text-gray-950">{item.title}</Text>
      <Text className="mt-1 text-sm text-gray-600">{item.body}</Text>
      <Text className="mt-2 text-xs font-semibold text-gray-400">{item.time}</Text>
    </View>
  );
}

export default function App() {
  const listRef = useRef(null);
  const [threads, setThreads] = useState(initialThreads);
  const [activeThreadId, setActiveThreadId] = useState(initialThreads[0].id);
  const [draft, setDraft] = useState("");
  const [notifications, setNotifications] = useState([
    {
      id: "welcome",
      title: "Notifications are on",
      body: "Unread messages and ride updates will appear here.",
      time: "Now",
    },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [banner, setBanner] = useState(null);

  const activeThread = useMemo(
    () => threads.find((thread) => thread.id === activeThreadId),
    [activeThreadId, threads],
  );

  const totalUnread = threads.reduce((sum, thread) => sum + thread.unread, 0);

  function openThread(threadId) {
    setActiveThreadId(threadId);
    setThreads((current) =>
      current.map((thread) =>
        thread.id === threadId ? { ...thread, unread: 0 } : thread,
      ),
    );
  }

  function pushNotification(title, body) {
    const notification = {
      id: `${Date.now()}`,
      title,
      body,
      time: getTimeLabel(),
    };

    setNotifications((current) => [notification, ...current]);
    setBanner(notification);
    setTimeout(() => setBanner(null), 3200);
  }

  function sendMessage() {
    const text = draft.trim();

    if (!text) {
      return;
    }

    const message = {
      id: `${Date.now()}`,
      senderId: me.id,
      text,
      time: getTimeLabel(),
    };

    setThreads((current) =>
      current.map((thread) =>
        thread.id === activeThreadId
          ? { ...thread, messages: [...thread.messages, message] }
          : thread,
      ),
    );
    setDraft("");
    pushNotification("Message sent", `Your message to ${activeThread.name} was delivered.`);

    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true });
    });
  }

  function simulateIncomingMessage() {
    const replies = [
      "Sounds good. I will be there on time.",
      "Can you pick me up near the main entrance?",
      "Thanks, I just sent the ride details.",
      "I may be five minutes late. Is that okay?",
    ];
    const text = replies[Math.floor(Math.random() * replies.length)];
    const message = {
      id: `${Date.now()}`,
      senderId: activeThread.id,
      text,
      time: getTimeLabel(),
    };

    setThreads((current) =>
      current.map((thread) =>
        thread.id === activeThreadId
          ? { ...thread, messages: [...thread.messages, message], unread: thread.unread + 1 }
          : thread,
      ),
    );
    pushNotification(`New message from ${activeThread.name}`, text);
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1 bg-slate-100">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
        >
          {banner ? (
            <Pressable
              onPress={() => setShowNotifications(true)}
              className="absolute left-4 right-4 top-4 z-10 rounded-lg bg-gray-950 p-4 shadow-lg"
            >
              <Text className="text-sm font-bold text-white">{banner.title}</Text>
              <Text className="mt-1 text-sm text-gray-200" numberOfLines={2}>
                {banner.body}
              </Text>
            </Pressable>
          ) : null}

          <View className="border-b border-gray-200 bg-white px-5 pb-4 pt-3">
            <View className="flex-row items-center justify-between gap-4">
              <View className="min-w-0 flex-1">
                <Text className="text-2xl font-bold text-gray-950">Carpool Messages</Text>
                <Text className="mt-1 text-sm text-gray-500">
                  Chat with riders and drivers in one place.
                </Text>
              </View>
              <Pressable
                onPress={() => setShowNotifications((value) => !value)}
                className="min-w-14 items-center rounded-lg border border-gray-300 px-3 py-2"
              >
                <Text className="text-xs font-bold uppercase text-gray-500">Alerts</Text>
                <Text className="text-lg font-bold text-emerald-700">{totalUnread}</Text>
              </Pressable>
            </View>
          </View>

          <View className="flex-1 md:flex-row">
            <View className="border-b border-gray-200 bg-slate-50 p-4 md:w-80 md:border-b-0 md:border-r">
              <FlatList
                data={threads}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <ThreadRow
                    thread={item}
                    active={item.id === activeThreadId}
                    onPress={() => openThread(item.id)}
                  />
                )}
                showsVerticalScrollIndicator={false}
              />
            </View>

            <View className="flex-1">
              <View className="border-b border-gray-200 bg-white p-4">
                <View className="flex-row items-center gap-3">
                  <Avatar name={activeThread.name} online={activeThread.online} />
                  <View className="min-w-0 flex-1">
                    <Text className="text-lg font-bold text-gray-950">{activeThread.name}</Text>
                    <Text className="text-sm text-gray-500">{activeThread.route}</Text>
                  </View>
                  <Pressable
                    onPress={simulateIncomingMessage}
                    className="rounded-lg bg-gray-950 px-3 py-2"
                  >
                    <Text className="text-sm font-bold text-white">Test alert</Text>
                  </Pressable>
                </View>
              </View>

              <FlatList
                ref={listRef}
                data={activeThread.messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <MessageBubble message={item} />}
                contentContainerStyle={{ padding: 16 }}
                className="flex-1"
                showsVerticalScrollIndicator={false}
              />

              <View className="border-t border-gray-200 bg-white p-4">
                <View className="flex-row items-end gap-3">
                  <TextInput
                    value={draft}
                    onChangeText={setDraft}
                    placeholder="Write a message..."
                    multiline
                    className="max-h-28 min-h-12 flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-950"
                    placeholderTextColor="#9ca3af"
                  />
                  <Pressable onPress={sendMessage} className="rounded-lg bg-emerald-700 px-5 py-3">
                    <Text className="text-base font-bold text-white">Send</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>

          {showNotifications ? (
            <View className="absolute bottom-0 right-0 top-0 w-full border-l border-gray-200 bg-slate-50 p-5 shadow-xl md:w-96">
              <View className="mb-5 flex-row items-center justify-between">
                <View>
                  <Text className="text-xl font-bold text-gray-950">Notifications</Text>
                  <Text className="mt-1 text-sm text-gray-500">
                    Message alerts and delivery updates.
                  </Text>
                </View>
                <Pressable
                  onPress={() => setShowNotifications(false)}
                  className="rounded-lg border border-gray-300 px-3 py-2"
                >
                  <Text className="font-bold text-gray-700">Close</Text>
                </Pressable>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                {notifications.map((notification) => (
                  <NotificationItem key={notification.id} item={notification} />
                ))}
              </ScrollView>
            </View>
          ) : null}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
