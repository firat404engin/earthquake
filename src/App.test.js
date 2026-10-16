const { normalizeAfad, normalizeKandilli, filterQuakes } = require('./quake-utils');
const event = {eventID:'1',date:'2026-10-16T21:22:19',latitude:'39.4',longitude:'40',magnitude:'1.3',depth:'0',type:'ML',location:'İZMİR'};
test('AFAD timestamps remain UTC and zero depth remains valid',()=>{const [q]=normalizeAfad([event]);expect(q.time).toBe('2026-10-16T21:22:19.000Z');expect(q.depth).toBe(0);});
test('malformed records and duplicate events are rejected',()=>{expect(normalizeAfad([event,event,{...event,eventID:'2',latitude:''}])).toHaveLength(1);});
test('Turkish searches compose with minimum magnitude',()=>{expect(filterQuakes(normalizeAfad([event]),{search:'izmir',minimum:1})).toHaveLength(1);expect(filterQuakes(normalizeAfad([event]),{minimum:2})).toHaveLength(0);});
test('Kandilli local timestamps convert to UTC',()=>{const [q]=normalizeKandilli([{date_time:'2026-10-17 00:22:19',title:'TUNCELI',mag:1.3,depth:7,geojson:{coordinates:[40,39]}}]);expect(q.time).toBe('2026-10-16T21:22:19.000Z');});
