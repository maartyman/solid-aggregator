"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CostQueueTimeFactory = void 0;
const tinyqueue_1 = __importDefault(require("tinyqueue"));
class CostQueueTimeFactory {
    create() {
        return new CostQueueTime();
    }
}
exports.CostQueueTimeFactory = CostQueueTimeFactory;
class CostQueueTime {
    priorityQueue;
    get length() {
        return this.priorityQueue.length;
    }
    constructor() {
        this.priorityQueue = new tinyqueue_1.default([], compare);
    }
    push(aggregatorService) {
        this.priorityQueue.push(aggregatorService);
    }
    pop() {
        return this.priorityQueue.pop();
    }
}
function compare(a, b) {
    if (a.costParameters === undefined) {
        if (b.costParameters === undefined) {
            return 0;
        }
        return -1;
    }
    if (b.costParameters === undefined) {
        return 1;
    }
    return a.costParameters.timeSeconds - b.costParameters.timeSeconds;
}
//# sourceMappingURL=CostQueueTime.js.map