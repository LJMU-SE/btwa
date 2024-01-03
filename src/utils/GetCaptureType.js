export default function getCaptureType(type) {
    switch (type) {
        case "360":
            return "360 Degree Video";
        default:
            return "Other";
    }
}
