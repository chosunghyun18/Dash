package com.dash.contactrequest.presentation;

public record AcceptContactResponse(
    Long requestId,
    String contactPhone,
    String contactEmail
) {
    public static AcceptContactResponse of(Long requestId, String phone, String email) {
        return new AcceptContactResponse(requestId, phone, email);
    }
}
