import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Queue, UserActiveToken, AppNotification, TokenStatus } from '../types/queue';
import { INITIAL_QUEUES } from '../data/mockQueues';
import { playChime } from '../utils/sound';

interface QueueContextType {
  queues: Queue[];
  activeUserToken: UserActiveToken | null;
  notifications: AppNotification[];
  selectedQueueId: string;
  isSimulating: boolean;
  soundEnabled: boolean;
  lastRefreshedAt: string;
  setSelectedQueueId: (id: string) => void;
  setSoundEnabled: (enabled: boolean) => void;
  // User Actions
  joinQueue: (queueId: string, userName: string, phone?: string, partySize?: number) => UserActiveToken;
  leaveQueue: () => void;
  refreshQueue: () => void;
  // Admin Actions
  callNextToken: (queueId?: string) => void;
  skipToken: (queueId?: string) => void;
  recallToken: (queueId?: string) => void;
  setActiveCounters: (queueId: string, count: number) => void;
  toggleQueueStatus: (queueId: string) => void;
  createNewQueue: (newQueue: Omit<Queue, 'currentToken' | 'lastToken' | 'counters' | 'waitingList'>) => Queue;
  // Demo Actions
  simulateNextToken: () => void;
  simulateJumpToApproaching: () => void;
  simulateJumpToYourTurn: () => void;
  resetDemo: () => void;
  // Notifications
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  dismissToast: (id: string) => void;
  activeToast: AppNotification | null;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

// Initial canonical user token for City Care Hospital
const INITIAL_USER_TOKEN: UserActiveToken = {
  tokenNumber: 57,
  queueId: 'QH-1024',
  userName: 'Alex Taylor',
  phone: '+1 (555) 234-5678',
  partySize: 1,
  joinedAt: '10:10 AM',
  status: 'waiting',
  estimatedWaitTime: 15, // (57 - 42) * 2 / 2 = 15 min
  peopleAhead: 15,
  counterAssigned: 3,
  notifiedStates: {
    approaching: false,
    almost: false,
    serving: false,
  },
};

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    notificationId: 'notif-1',
    title: 'Joined City Care Hospital Queue',
    message: 'You have been assigned Token #57. 15 people are currently ahead of you.',
    timestamp: '10:10 AM',
    read: true,
    type: 'info',
    tokenNumber: 57,
    queueId: 'QH-1024',
  },
  {
    notificationId: 'notif-2',
    title: 'Queue Moving Normally',
    message: 'Token #42 is currently being served at Counter 1.',
    timestamp: '10:12 AM',
    read: false,
    type: 'progress',
    tokenNumber: 42,
    queueId: 'QH-1024',
  },
];

export const QueueProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [queues, setQueues] = useState<Queue[]>(() => {
    const saved = localStorage.getItem('queueless_queues_v1');
    return saved ? JSON.parse(saved) : INITIAL_QUEUES;
  });

  const [activeUserToken, setActiveUserToken] = useState<UserActiveToken | null>(() => {
    const saved = localStorage.getItem('queueless_user_token_v1');
    return saved !== null ? (saved ? JSON.parse(saved) : null) : INITIAL_USER_TOKEN;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('queueless_notifications_v1');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [selectedQueueId, setSelectedQueueId] = useState<string>('QH-1024');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isSimulating] = useState<boolean>(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>('Just now');
  const [activeToast, setActiveToast] = useState<AppNotification | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('queueless_queues_v1', JSON.stringify(queues));
  }, [queues]);

  useEffect(() => {
    localStorage.setItem('queueless_user_token_v1', JSON.stringify(activeUserToken));
  }, [activeUserToken]);

  useEffect(() => {
    localStorage.setItem('queueless_notifications_v1', JSON.stringify(notifications));
  }, [notifications]);

  // Helper to add notification with sound and toast
  const pushNotification = useCallback(
    (notif: Omit<AppNotification, 'notificationId' | 'timestamp' | 'read'>) => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const fullNotif: AppNotification = {
        ...notif,
        notificationId: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: timeStr,
        read: false,
      };

      setNotifications((prev) => [fullNotif, ...prev]);
      setActiveToast(fullNotif);

      // Play appropriate sound
      if (soundEnabled) {
        if (fullNotif.type === 'alert' || fullNotif.type === 'success') {
          playChime('your_turn');
        } else if (fullNotif.type === 'warning') {
          playChime('approaching');
        } else {
          playChime('progress');
        }
      }

      // Auto dismiss toast after 5s
      setTimeout(() => {
        setActiveToast((current) => (current?.notificationId === fullNotif.notificationId ? null : current));
      }, 5000);
    },
    [soundEnabled]
  );

  // Sync user token when queues change
  useEffect(() => {
    if (!activeUserToken) return;

    const queue = queues.find((q) => q.queueId === activeUserToken.queueId);
    if (!queue) return;

    const peopleAhead = Math.max(0, activeUserToken.tokenNumber - queue.currentToken);
    const estimatedWait = Math.max(
      peopleAhead === 0 ? 0 : 1,
      Math.ceil((peopleAhead * queue.averageServiceTime) / Math.max(1, queue.activeCounters))
    );

    let status: TokenStatus = 'waiting';
    if (activeUserToken.tokenNumber <= queue.currentToken) {
      status = 'serving';
    } else if (peopleAhead <= 1) {
      status = 'almost';
    } else if (peopleAhead <= 5) {
      status = 'approaching';
    }

    // Check notification triggers
    const updatedNotified = { ...activeUserToken.notifiedStates };

    if (status === 'approaching' && !updatedNotified.approaching) {
      updatedNotified.approaching = true;
      pushNotification({
        title: '🔔 Your turn is approaching',
        message: `Only ${peopleAhead} tokens ahead of you in ${queue.organizationName}. Start moving toward the area.`,
        type: 'warning',
        tokenNumber: activeUserToken.tokenNumber,
        queueId: queue.queueId,
      });
    }

    if (status === 'almost' && !updatedNotified.almost) {
      updatedNotified.almost = true;
      pushNotification({
        title: '🔔 Almost your turn',
        message: `Token #${queue.currentToken} is serving. Please return to the waiting area immediately.`,
        type: 'warning',
        tokenNumber: activeUserToken.tokenNumber,
        queueId: queue.queueId,
      });
    }

    if (status === 'serving' && !updatedNotified.serving) {
      updatedNotified.serving = true;
      pushNotification({
        title: '🎉 It’s Your Turn!',
        message: `Token #${activeUserToken.tokenNumber} is now being called! Please proceed to Counter ${activeUserToken.counterAssigned || 3}.`,
        type: 'success',
        tokenNumber: activeUserToken.tokenNumber,
        queueId: queue.queueId,
      });
    }

    setActiveUserToken((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        peopleAhead,
        estimatedWaitTime: estimatedWait,
        status,
        notifiedStates: updatedNotified,
      };
    });
  }, [queues, activeUserToken?.tokenNumber, activeUserToken?.queueId, pushNotification]);

  // User Actions
  const joinQueue = (queueId: string, userName: string, phone?: string, partySize: number = 1): UserActiveToken => {
    const queue = queues.find((q) => q.queueId === queueId) || queues[0];
    const newTokenNum = queue.lastToken + 1;
    const peopleAhead = Math.max(0, newTokenNum - queue.currentToken);
    const estimatedWait = Math.max(
      1,
      Math.ceil((peopleAhead * queue.averageServiceTime) / Math.max(1, queue.activeCounters))
    );

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newToken: UserActiveToken = {
      tokenNumber: newTokenNum,
      queueId: queue.queueId,
      userName: userName || 'Visitor',
      phone: phone || '',
      partySize,
      joinedAt: timeStr,
      status: peopleAhead <= 5 ? (peopleAhead <= 1 ? 'almost' : 'approaching') : 'waiting',
      estimatedWaitTime: estimatedWait,
      peopleAhead,
      counterAssigned: Math.floor(Math.random() * queue.activeCounters) + 1,
      notifiedStates: {
        approaching: false,
        almost: false,
        serving: false,
      },
    };

    // Update queue last token and waiting list
    setQueues((prev) =>
      prev.map((q) => {
        if (q.queueId === queue.queueId) {
          return {
            ...q,
            lastToken: newTokenNum,
            waitingList: [
              ...q.waitingList,
              {
                tokenNumber: newTokenNum,
                userName: newToken.userName,
                phone: newToken.phone,
                partySize: newToken.partySize,
                joinedAt: newToken.joinedAt,
                status: 'waiting',
              },
            ],
          };
        }
        return q;
      })
    );

    setActiveUserToken(newToken);

    pushNotification({
      title: 'Joined Queue Successfully',
      message: `Your token is #${newTokenNum} at ${queue.organizationName}. Estimated wait: ${estimatedWait} min.`,
      type: 'info',
      tokenNumber: newTokenNum,
      queueId: queue.queueId,
    });

    return newToken;
  };

  const leaveQueue = () => {
    if (!activeUserToken) return;
    const prevQueueId = activeUserToken.queueId;
    const prevNum = activeUserToken.tokenNumber;

    setQueues((prev) =>
      prev.map((q) => {
        if (q.queueId === prevQueueId) {
          return {
            ...q,
            waitingList: q.waitingList.filter((item) => item.tokenNumber !== prevNum),
          };
        }
        return q;
      })
    );

    setActiveUserToken(null);
    pushNotification({
      title: 'Left Queue',
      message: `You have cancelled Token #${prevNum}. You are no longer in line.`,
      type: 'info',
    });
  };

  const refreshQueue = () => {
    setLastRefreshedAt('Just now');
    if (soundEnabled) {
      playChime('progress');
    }
  };

  // Admin Actions
  const callNextToken = (targetQueueId?: string) => {
    const qId = targetQueueId || selectedQueueId;
    setQueues((prev) =>
      prev.map((q) => {
        if (q.queueId === qId) {
          const nextTokenNum = q.currentToken + 1;
          const assignedCounterId = ((nextTokenNum % q.activeCounters) || q.activeCounters);

          // Update counters
          const updatedCounters = q.counters.map((c) =>
            c.id === assignedCounterId ? { ...c, currentServingToken: nextTokenNum, status: 'busy' as const } : c
          );

          // Update waiting list
          const updatedWaiting = q.waitingList.map((item) =>
            item.tokenNumber === nextTokenNum
              ? { ...item, status: 'serving' as const, counterAssigned: assignedCounterId }
              : item.tokenNumber < nextTokenNum
              ? { ...item, status: 'completed' as const }
              : item
          );

          return {
            ...q,
            currentToken: nextTokenNum,
            counters: updatedCounters,
            waitingList: updatedWaiting,
          };
        }
        return q;
      })
    );

    const qObj = queues.find((q) => q.queueId === qId);
    const nextTokenNum = (qObj?.currentToken || 0) + 1;

    pushNotification({
      title: '🔔 Token Called',
      message: `Token #${nextTokenNum} is now being served at Counter ${(nextTokenNum % (qObj?.activeCounters || 2)) || 1}.`,
      type: 'progress',
      tokenNumber: nextTokenNum,
      queueId: qId,
    });
  };

  const skipToken = (targetQueueId?: string) => {
    const qId = targetQueueId || selectedQueueId;
    const qObj = queues.find((q) => q.queueId === qId);
    if (!qObj) return;

    const skippedNum = qObj.currentToken;
    callNextToken(qId);

    pushNotification({
      title: `Token #${skippedNum} Skipped`,
      message: `Token #${skippedNum} was absent and marked as skipped. Calling next customer.`,
      type: 'warning',
      tokenNumber: skippedNum,
      queueId: qId,
    });
  };

  const recallToken = (targetQueueId?: string) => {
    const qId = targetQueueId || selectedQueueId;
    const qObj = queues.find((q) => q.queueId === qId);
    if (!qObj) return;

    pushNotification({
      title: `🔔 Recall: Token #${qObj.currentToken}`,
      message: `Recall announcement triggered for Token #${qObj.currentToken} at Counter 1.`,
      type: 'alert',
      tokenNumber: qObj.currentToken,
      queueId: qId,
    });
  };

  const setActiveCounters = (queueId: string, count: number) => {
    setQueues((prev) =>
      prev.map((q) => {
        if (q.queueId === queueId) {
          return {
            ...q,
            activeCounters: Math.max(1, count),
          };
        }
        return q;
      })
    );
  };

  const toggleQueueStatus = (queueId: string) => {
    setQueues((prev) =>
      prev.map((q) => {
        if (q.queueId === queueId) {
          const nextStatus = q.status === 'active' ? 'paused' : 'active';
          return { ...q, status: nextStatus };
        }
        return q;
      })
    );
  };

  const createNewQueue = (newQueueData: Omit<Queue, 'currentToken' | 'lastToken' | 'counters' | 'waitingList'>): Queue => {
    const generatedCounters = Array.from({ length: newQueueData.activeCounters }, (_, i) => ({
      id: i + 1,
      name: `Counter ${i + 1}`,
      staffName: `Agent ${i + 1}`,
      currentServingToken: 1,
      status: 'active' as const,
    }));

    const fullQueue: Queue = {
      ...newQueueData,
      currentToken: 1,
      lastToken: 5,
      counters: generatedCounters,
      waitingList: [
        { tokenNumber: 1, userName: 'First In Line', partySize: 1, joinedAt: '09:00 AM', status: 'serving', counterAssigned: 1 },
        { tokenNumber: 2, userName: 'Second Visitor', partySize: 1, joinedAt: '09:05 AM', status: 'waiting' },
        { tokenNumber: 3, userName: 'Third Visitor', partySize: 2, joinedAt: '09:10 AM', status: 'waiting' },
        { tokenNumber: 4, userName: 'Fourth Visitor', partySize: 1, joinedAt: '09:15 AM', status: 'waiting' },
        { tokenNumber: 5, userName: 'Fifth Visitor', partySize: 1, joinedAt: '09:20 AM', status: 'waiting' },
      ],
    };

    setQueues((prev) => [fullQueue, ...prev]);
    setSelectedQueueId(fullQueue.queueId);

    pushNotification({
      title: 'New Queue Created',
      message: `${fullQueue.organizationName} (${fullQueue.queueId}) is now live.`,
      type: 'info',
      queueId: fullQueue.queueId,
    });

    return fullQueue;
  };

  // Demo helpers
  const simulateNextToken = () => {
    callNextToken(activeUserToken?.queueId || 'QH-1024');
  };

  const simulateJumpToApproaching = () => {
    if (!activeUserToken) return;
    const targetQId = activeUserToken.queueId;
    const targetServing = Math.max(1, activeUserToken.tokenNumber - 5);

    setQueues((prev) =>
      prev.map((q) => {
        if (q.queueId === targetQId) {
          return {
            ...q,
            currentToken: targetServing,
          };
        }
        return q;
      })
    );
  };

  const simulateJumpToYourTurn = () => {
    if (!activeUserToken) return;
    const targetQId = activeUserToken.queueId;

    setQueues((prev) =>
      prev.map((q) => {
        if (q.queueId === targetQId) {
          return {
            ...q,
            currentToken: activeUserToken.tokenNumber,
            counters: q.counters.map((c, idx) =>
              idx === 2 ? { ...c, currentServingToken: activeUserToken.tokenNumber, status: 'busy' } : c
            ),
          };
        }
        return q;
      })
    );
  };

  const resetDemo = () => {
    setQueues(INITIAL_QUEUES);
    setActiveUserToken(INITIAL_USER_TOKEN);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSelectedQueueId('QH-1024');
    pushNotification({
      title: 'Demo State Reset',
      message: 'Queue reset to initial demo: Token #42 serving, Your Token #57.',
      type: 'info',
    });
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.notificationId === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const dismissToast = (id: string) => {
    setActiveToast((current) => (current?.notificationId === id ? null : current));
  };

  return (
    <QueueContext.Provider
      value={{
        queues,
        activeUserToken,
        notifications,
        selectedQueueId,
        isSimulating,
        soundEnabled,
        lastRefreshedAt,
        setSelectedQueueId,
        setSoundEnabled,
        joinQueue,
        leaveQueue,
        refreshQueue,
        callNextToken,
        skipToken,
        recallToken,
        setActiveCounters,
        toggleQueueStatus,
        createNewQueue,
        simulateNextToken,
        simulateJumpToApproaching,
        simulateJumpToYourTurn,
        resetDemo,
        markNotificationAsRead,
        clearAllNotifications,
        dismissToast,
        activeToast,
      }}
    >
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};
