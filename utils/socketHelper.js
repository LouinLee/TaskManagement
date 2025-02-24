module.exports.emitEvent = (req, event, data) => {
    const io = req.app.get("socketio");
    if (io) {
        io.emit(event, data);
    } else {
        console.error(`WebSocket (io) is undefined! Failed to emit event: ${event}`);
    }
};
