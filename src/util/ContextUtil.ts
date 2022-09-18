/**
 * Context Util
 *
 * @author Yepeng Ding
 */
export class ContextUtil {

    /**
     * Get context of a given key type.
     *
     * @param keyType
     */
    public static contextOfKeyType(keyType: string): string {
        switch (keyType) {
            case "JsonWebKey2020":
                return "https://w3id.org/security/suites/jws-2020/v1";
            default:
                throw Error(`The context of (${keyType}) is not supported.`);
        }
    }

}
