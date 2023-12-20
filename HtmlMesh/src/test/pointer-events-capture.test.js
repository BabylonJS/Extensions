import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { getCapturingId, releaseCurrent, requestCapture, requestRelease } from '../pointer-events-capture';

describe('requestCapture', () => {
  beforeEach(() => {
    while(getCapturingId()) {
      releaseCurrent();
    }
  });

  it('should grant the request if there is no current owner', () => {
    // Arrange
    const requestId = 'request1';
    const captureCallback = jest.fn();
    const releaseCallback = jest.fn();

    // Act
    requestCapture(requestId, captureCallback, releaseCallback);

    // Assert
    expect(captureCallback).toBeCalledTimes(1);
    expect(releaseCallback).not.toHaveBeenCalled();
  });

  it('should ignore the request if there is a matching release request', () => {
    // Arrange
    const requestId = 'request1';
    const captureCallback = jest.fn();
    const releaseCallback = jest.fn();

    // Simulate a previous release request for the same id
    requestRelease(requestId);

    // Act
    requestCapture(requestId, captureCallback, releaseCallback);

    // Assert
    expect(captureCallback).not.toHaveBeenCalled();
    expect(releaseCallback).not.toHaveBeenCalled();
  });

  it('should enqueue the request if it is not already in the queue', () => {
    // Arrange
    const requestId1 = 'request1';
    const captureCallback1 = jest.fn();
    const releaseCallback1 = jest.fn();

    const requestId2 = 'request2';
    const captureCallback2 = jest.fn();
    const releaseCallback2 = jest.fn();
    
    // Act
    requestCapture(requestId1, captureCallback1, releaseCallback1);
    requestCapture(requestId2, captureCallback2, releaseCallback2);
    releaseCurrent();

    // Assert
    expect(captureCallback1).toBeCalledTimes(1);
    expect(releaseCallback1).toBeCalledTimes(1);
    expect(captureCallback2).toBeCalledTimes(1);
    expect(releaseCallback2).not.toHaveBeenCalled();
  });

  it('should do nothing if the request id is the current owner', () => {
    // Arrange
    const requestId = 'request1';
    const captureCallback = jest.fn();
    const releaseCallback = jest.fn();

    // Act
    requestCapture(requestId, captureCallback, releaseCallback);
    requestCapture(requestId, captureCallback, releaseCallback);
    

    // Assert
    expect(captureCallback).toBeCalledTimes(1);
    expect(releaseCallback).not.toHaveBeenCalled();
  });
});

describe('requestRelease', () => {
  beforeEach(() => {
    while(getCapturingId()) {
      releaseCurrent();
    }
  });

  it('should remove the request from the queue if it is not the current owner', () => {
    // Current owner
    const requestId1 = 'request1';
    const captureCallback1 = jest.fn();
    const releaseCallback1 = jest.fn();

    // Other request (this will get the pointer events when the first request is released)
    const requestId2 = 'request2';
    const captureCallback2 = jest.fn();
    const releaseCallback2 = jest.fn();

    // Third request (this will get removed)
    const requestId3 = 'request3';
    const captureCallback3 = jest.fn();
    const releaseCallback3 = jest.fn();

    // First make  request1 the current owner
    requestCapture(requestId1, captureCallback1, releaseCallback1);

    // Add request2 to the queue
    requestCapture(requestId2, captureCallback2, releaseCallback2);

    // Add request3 to the queue
    requestCapture(requestId3, captureCallback3, releaseCallback3);

    // Release request2
    requestRelease(requestId3);

    // Release request1, request 2 should get the pointer events
    releaseCurrent();

    // Assert
    expect(captureCallback1).toBeCalledTimes(1);
    expect(releaseCallback1).toBeCalledTimes(1);
    expect(captureCallback2).toBeCalledTimes(1);
    expect(releaseCallback2).not.toHaveBeenCalled();
    expect(captureCallback3).not.toHaveBeenCalled();
    expect(releaseCallback3).not.toHaveBeenCalled();
  });

  it('should ignore a capture request if there is an unmatched release request for the same id', () => {
    // Current owner
    const requestId1 = 'request1';
    const captureCallback1 = jest.fn();
    const releaseCallback1 = jest.fn();

    // 1st release request (this will be unmatched, but a capture request will not be received)
    const requestId2 = 'request2';
    const captureCallback2 = jest.fn();
    const releaseCallback2 = jest.fn();

    // 2nd release request (this will be matched)
    const requestId3 = 'request3';
    const captureCallback3 = jest.fn();
    const releaseCallback3 = jest.fn();

    // Second capture request (this will get the pointer events when the first request is released)
    const requestId4 = 'request4';
    const captureCallback4 = jest.fn();
    const releaseCallback4 = jest.fn();

    // Request capture for request1
    requestCapture(requestId1, captureCallback1, releaseCallback1);

    // Request release for request2
    requestRelease(requestId2);

    // Request release for request3
    requestRelease(requestId3);

    // Request capture for request4
    requestCapture(requestId4, captureCallback4, releaseCallback4);

    // Now request capture for request3 (this should match the release request and therefore be ignored)
    requestCapture(requestId3, captureCallback3, releaseCallback3);

    // Release request1, request 4 should get the pointer events
    releaseCurrent();

    // Assert
    expect(captureCallback1).toBeCalledTimes(1);
    expect(releaseCallback1).toBeCalledTimes(1);
    expect(captureCallback2).not.toHaveBeenCalled();
    expect(releaseCallback2).not.toHaveBeenCalled();
    expect(captureCallback3).not.toHaveBeenCalled();
    expect(releaseCallback3).not.toHaveBeenCalled();
    expect(captureCallback4).toBeCalledTimes(1);
    expect(releaseCallback4).not.toHaveBeenCalled();
  });
});