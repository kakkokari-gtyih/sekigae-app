import Encoding from 'encoding-japanese'
 
export function toShiftJIS(utf8String: string): Uint8Array {
    const detected = Encoding.detect(utf8String)
    const unicodeList = []
 
    for (let i = 0; i < utf8String.length; i += 1) {
        unicodeList.push(utf8String.charCodeAt(i))
    }
 
    const sjisArray = Encoding.convert(unicodeList, {
        to: 'SJIS',
        from: detected ? detected : 'UTF8',
    })
    return new Uint8Array(sjisArray)
}