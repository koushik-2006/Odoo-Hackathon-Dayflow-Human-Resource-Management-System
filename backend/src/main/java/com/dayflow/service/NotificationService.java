package com.dayflow.service;

import com.dayflow.dto.notification.NotificationResponse;

import java.util.List;

public interface NotificationService {
    List<NotificationResponse> getMyNotifications(Long userId);
    void markAsRead(Long notificationId);
}
