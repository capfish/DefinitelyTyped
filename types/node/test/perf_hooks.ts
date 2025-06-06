import {
    constants,
    createHistogram,
    EntryType,
    IntervalHistogram,
    monitorEventLoopDelay,
    NodeGCPerformanceDetail,
    performance as NodePerf,
    PerformanceEntry,
    PerformanceMark,
    PerformanceObserver,
    PerformanceObserverCallback,
    RecordableHistogram,
} from "node:perf_hooks";

// Test module import once, the rest use global
const startMark: PerformanceMark = NodePerf.mark("start");
(() => {})();
performance.mark("end");

performance.mark("test", {
    detail: "something",
    startTime: 123,
});

performance.measure("name", startMark.name, "endMark");

const timeOrigin: number = performance.timeOrigin;

const performanceObserverCallback: PerformanceObserverCallback = (list, obs) => {
    const entries: PerformanceEntry[] = list.getEntries();
    const duration: number = entries[0].duration;
    const name: string = entries[0].name;
    const startTime: number = entries[0].startTime;
    const entryTypes: EntryType = entries[0].entryType;
    const detail: NodeGCPerformanceDetail = entries[0].detail as NodeGCPerformanceDetail;
    const kind: number | undefined = detail.kind;
    const flags: number | undefined = detail.flags;

    if (kind === constants.NODE_PERFORMANCE_GC_MAJOR) {
        if (flags === constants.NODE_PERFORMANCE_GC_FLAGS_ALL_EXTERNAL_MEMORY) {
        }
    }

    obs.disconnect();
};
const obs = new PerformanceObserver(performanceObserverCallback);
obs.observe({
    entryTypes: ["gc"],
    buffered: true,
});
obs.observe({
    type: "gc",
    buffered: true,
});

const monitor: IntervalHistogram = monitorEventLoopDelay({
    resolution: 42,
});

monitor.enable();
monitor.reset();
monitor.disable();
const perc: number = monitor.percentile(99);
const perc2: number | undefined = monitor.percentiles.get(42);

const min: number = monitor.min;
const max: number = monitor.max;
const mean: number = monitor.mean;
const stddev: number = monitor.stddev;
const exceeds: number = monitor.exceeds;

let histogram: RecordableHistogram = createHistogram({
    figures: 123,
    lowest: 1,
    highest: 2,
});
histogram = createHistogram();

histogram.record(123);
histogram.record(123n);
histogram.recordDelta();

// intelligence is working
declare let histo1: RecordableHistogram;
declare let histo2: RecordableHistogram;
declare let histo3: RecordableHistogram;

histo1.add(histo2);
histo1.add(histo3);

histo1 = createHistogram();
histo2 = createHistogram();
histo3 = createHistogram();

histo1.record(456);
histo1.record(547);
histo1.record(789);
histo1.record(123);

histo2.record(456);
histo2.record(547);
histo2.record(789);
histo2.record(123);

histo3.record(456);
histo3.record(547);
histo3.record(789);
histo3.record(123);

histo1.add(histo2);
histo1.add(histo3);

performance.clearMarks();
performance.clearMarks("test");

performance.clearMeasures();
performance.clearMeasures("test");

performance.getEntries()[0]; // $ExpectType PerformanceEntry

performance.getEntriesByName("test")[0]; // $ExpectType PerformanceEntry
performance.getEntriesByName("test", "mark")[0]; // $ExpectType PerformanceEntry

performance.getEntriesByType("mark")[0]; // $ExpectType PerformanceEntry

const resource = NodePerf.markResourceTiming(
    {
        startTime: 0,
        endTime: 0,
        finalServiceWorkerStartTime: 0,
        redirectStartTime: 0,
        redirectEndTime: 0,
        postRedirectStartTime: 0,
        finalConnectionTimingInfo: {
            domainLookupStartTime: 0,
            domainLookupEndTime: 0,
            connectionStartTime: 0,
            connectionEndTime: 0,
            secureConnectionStartTime: 0,
            ALPNNegotiatedProtocol: "",
        },
        finalNetworkRequestStartTime: 0,
        finalNetworkResponseStartTime: 0,
        encodedBodySize: 0,
        decodedBodySize: 0,
    },
    "https://nodejs.org",
    "",
    global,
    "",
    {},
    200,
    "",
);
resource; // $ExpectType PerformanceResourceTiming

{
    const { nodeTiming } = NodePerf;

    // $ExpectType UVMetrics
    const uvMetrics = nodeTiming.uvMetricsInfo;

    uvMetrics.loopCount; // $ExpectType number
    uvMetrics.events; // $ExpectType number
    uvMetrics.eventsWaiting; // $ExpectType number
}
