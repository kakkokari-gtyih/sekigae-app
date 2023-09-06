<template>
    <div class="relative bg-slate-50 dark:bg-slate-900">
        <UContainer class="relative py-12 space-y-6">
            <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-200">
                {{ $t('common.nav.terms') }}
            </h1>
            <UCard>
                <div class="markdown-body" v-if="locale === 'ja'">
                    <p>この利用規約（以下、「本規約」といいます。）は、「かっこかり」（以下、「運営者」といいます。）が共同で運営ないし提供する、高機能席替えアプリ「Sekigae.app」（以下、「当サービス」といいます。）の利用にかかる条件を定めるものです。このウェブサイト（<code>sekigae.app</code>）を閲覧する者、または当サービスにインターネット経由でアクセスして利用する者（以下、まとめて「ユーザー」といいます。）には、本規約に従って、当サービスをご利用いただきます。</p>
                    <p>なお、この規約は、<strong>オープンソースソフトウェアである本ソフトウェア、およびそれを利用したサービスに関して適用される利用規約ではありません。</strong><code>sekigae.app</code>上でのみ適用される規約であることにご留意ください。</p>
                    <p>本ソフトウェアそのものは、<a href="https://github.com/kakkokari-gtyih/sekigae-app">ソースコード</a>に示されている通り、GNU Affero General Public License v3.0の下で提供されます。また、当サービス（<code>sekigae.app</code>）以外で本ソフトウェアを利用したサービスがある場合、その利用条件等は、当該サービスの提供者にお問い合わせください。</p>
                    <h2 id="-1-">第1条（適用）</h2>
                    <ol>
                        <li>本規約は、ユーザーと運営者との間の当サービスの利用に関わる一切の関係に適用されるものとします。</li>
                        <li>運営者は当サービスに関し、本規約のほか、ご利用にあたってのルール等、各種の定め（以下、「個別規定」といいます。）をすることがあります。これら個別規定はその名称のいかんに関わらず、本規約の一部を構成するものとします。
                        </li>
                        <li>本規約の規定が前条の個別規定の規定と矛盾する場合には、個別規定において特段の定めなき限り、個別規定の規定が優先されるものとします。</li>
                    </ol>
                    <h2 id="-2-">第2条（利用条件・手続）</h2>
                    <p>当サービスの利用に当たって、利用登録は必要ありません。</p>
                    <h2 id="-3-">第3条（利用料金および支払方法）</h2>
                    <p>当サービスの利用の対価は無料とします。</p>
                    <h2 id="-4-">第4条（禁止事項）</h2>
                    <p>ユーザーは、当サービスを利用するに当たり、以下の行為をしてはいけません。</p>
                    <ul>
                        <li>運営者、当サービスの他のユーザー、または第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
                        <li>当サービスの運営を妨害するおそれのある行為</li>
                        <li>不正アクセスをし、またはこれを試みる行為</li>
                        <li>当サービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為</li>
                        <li>運営者、当サービスの他のユーザーまたは第三者の知的財産権、肖像権、プライバシー、名誉その他の権利または利益を侵害する行為</li>
                        <li>以下を目的とし、または目的とすると運営者が判断する行為<ul>
                                <li>当サービスの利用が直接的に営業・宣伝・広告・勧誘・その他営利を目的とすることにつながる行為（運営者の認めたものを除きます。）</li>
                                <li>性行為やわいせつな行為を目的とする行為</li>
                                <li>面識のない異性との出会いや交際を目的とする行為</li>
                                <li>他のユーザーに対する嫌がらせや誹謗中傷を目的とする行為</li>
                                <li>運営者、当サービスの他のユーザー、または第三者に不利益、損害または不快感を与えることを目的とする行為</li>
                                <li>その他、運営者が想定している利用目的と異なる目的で当サービスを利用する行為</li>
                                <li>宗教活動または宗教団体への勧誘行為</li>
                            </ul>
                        </li>
                        <li>その他、運営者が不適切と判断する行為</li>
                    </ul>
                    <h2 id="-5-">第5条（当サービスの提供の停止等）</h2>
                    <ol>
                        <li>運営者は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく当サービスの全部または一部の提供を停止または中断することができるものとします。<ul>
                                <li>当サービスにかかるコンピュータシステムの保守点検または更新を行う場合</li>
                                <li>地震、落雷、火災、停電または天災などの不可抗力により、当サービスの提供が困難となった場合</li>
                                <li>コンピュータまたは通信回線等が事故により停止した場合</li>
                                <li>その他、運営者が当サービスの提供が困難と判断した場合</li>
                            </ul>
                        </li>
                        <li>運営者は、運営者の都合により、当サービスの提供を終了することができます。この場合、運営者は利用者に事前に通知するものとします。</li>
                        <li>運営者は、当サービスの提供の停止または中断により、ユーザーまたは第三者が被ったいかなる不利益または損害についても、一切の責任を負わないものとします。</li>
                    </ol>
                    <h2 id="-6-">第6条（利用制限）</h2>
                    <ol>
                        <li>運営者は、ユーザーが以下のいずれかに該当する場合には、事前の通知なく、ユーザーに対して当サービスの全部もしくは一部の利用を制限できるものとします。<ul>
                                <li>本規約のいずれかの条項に違反した場合</li>
                                <li>登録事項に虚偽の事実があることが判明した場合</li>
                                <li>債務不履行があった場合</li>
                                <li>運営者からの連絡に対し、一定期間返答がない場合</li>
                                <li>当サービスについて、最終の利用から一定期間利用がない場合</li>
                                <li>その他、運営者が当サービスの利用を適当でないと判断した場合</li>
                            </ul>
                        </li>
                        <li>前項各号のいずれかに該当した場合、ユーザーは、当然に運営者に対する一切の債務について期限の利益を失い、その時点において負担する一切の債務を直ちに一括して弁済しなければなりません。</li>
                        <li>運営者は、本条に基づき運営者が行った行為によりユーザーに生じた損害について、一切の責任を負いません。</li>
                    </ol>
                    <h2 id="-7-">第7条（保証の否認および免責事項）</h2>
                    <ol>
                        <li>運営者は、当サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。</li>
                        <li>運営者は、当サービスに起因してユーザーに生じたあらゆる損害について、運営者の故意又は重過失による場合を除き、一切の責任を負いません。ただし、当サービスに関する運営者とユーザーとの間の契約（本規約を含みます。）が消費者契約法に定める消費者契約となる場合、この免責規定は適用されません。</li>
                        <li>前項ただし書に定める場合であっても、運営者は、運営者の過失（重過失を除きます。）による債務不履行または不法行為によりユーザーに生じた損害のうち特別な事情から生じた損害（運営者またはユーザーが損害発生につき予見し、または予見し得た場合を含みます。）について一切の責任を負いません。また、運営者の過失（重過失を除きます。）による債務不履行または不法行為によりユーザーに生じた損害の賠償は、ユーザーから当該損害が発生した月に受領した利用料の額を上限とします。</li>
                        <li>運営者は、当サービスに関して、ユーザーと他のユーザーまたは第三者との間において生じた取引、連絡または紛争等について一切責任を負いません。</li>
                    </ol>
                    <h2 id="-8-">第8条（サービス内容の変更等）</h2>
                    <p>運営者は、当サービスのサービス内容や仕様を変更、追加または廃止することがあり、ユーザーはこれを承諾するものとします。</p>
                    <h2 id="-9-">第9条（個人情報）</h2>
                    <p>当サービスは、個人を特定できる情報の収集・保存を行っておりません。</p>
                    <h2 id="-10-">第10条（利用規約の変更）</h2>
                    <ol>
                        <li>運営者は以下の場合には、ユーザーの個別の同意を要せず、本規約を変更することができるものとします。
                            <ul>
                                <li>本規約の変更がユーザーの一般の利益に適合するとき。</li>
                                <li>本規約の変更が当サービス利用契約の目的に反せず、かつ、変更の必要性、変更後の内容の相当性その他の変更に係る事情に照らして合理的なものであるとき。</li>
                            </ul>
                        </li>
                        <li>運営者はユーザーに対し、前項による本規約の変更にあたり、事前に、本規約を変更する旨及び変更後の本規約の内容並びにその効力発生時期を通知します。</li>
                        <li>変更した規約が発効した後に当サービスを利用した者は、変更後の規約に同意したものとみなします。</li>
                    </ol>
                    <h2 id="-11-">第11条（通知または連絡）</h2>
                    <p>ユーザーと運営者との間の通知または連絡は、運営者の定める方法によって行うものとします。運営者は、ユーザーから、運営者が別途定める方式に従った変更届け出がない限り、現在登録されている連絡先が有効なものとみなして当該連絡先へ通知または連絡を行い、これらは、発信時にユーザーへ到達したものとみなします。
                    </p>
                    <h2 id="-12-">第12条（権利義務の譲渡の禁止）</h2>
                    <p>ユーザーは、運営者の書面による事前の承諾なく、利用契約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡し、または担保に供することはできません。</p>
                    <h2 id="-13-">第13条（翻訳された規約の位置づけ）</h2>
                    <p>本規約や個別規定は、ユーザーの利便性のためにその一部または全部が翻訳されることがありますが、言語間で齟齬が生まれた場合は、原版である日本語版を優先して適用するものとします。</p>
                    <p>The main agreement and individual provisions may be translated for the convenience of users, but in
                        case of any discrepancies between different languages, the original Japanese version shall take
                        precedence and apply.</p>
                    <h2 id="-14-">第14条（分離可能性）</h2>
                    <p>本規約のいずれかの条項又はその一部が、消費者契約法その他の法令等により無効又は執行不能と判断された場合であっても、本規約の残りの規定及び一部が無効又は執行不能と判断された規定の残りの部分は、継続して完全に効力を有し、運営者及びユーザーは、当該無効若しくは執行不能の条項又は部分を適法とし、執行力を持たせるために必要な範囲で修正し、当該無効若しくは執行不能な条項又は部分の趣旨並びに法律的及び経済的に同等の効果を確保できるように努めるものとします。
                    </p>
                    <h2 id="-15-">第15条（準拠法・裁判管轄）</h2>
                    <ol>
                        <li>本規約の解釈にあたっては、日本法を準拠法とします。</li>
                        <li>当サービスに関して紛争が生じた場合には、運営者の住所を管轄する裁判所を専属的合意管轄とします。</li>
                    </ol>
                    <h2 id="-">更新履歴</h2>
                    <ul>
                        <li>2023年08月18日　制定</li>
                    </ul>
                </div>
                <div class="markdown-body" v-else>
                    <p>This Terms of Use Agreement ("Agreement") sets forth the terms and conditions for the use of the high-functionality seat assignment application "Sekigae.app" (hereinafter referred to as the "Service") operated or provided by and "Kakkokari" (hereinafter referred to as the "Operator"). By browsing this website (<code>sekigae.app</code>) or accessing and using the Service via the internet, you (hereinafter referred to as the "User") agree to use the Service in accordance with this Agreement.</p>

                    <p>Please note that this Agreement is not applicable to open-source software and services using it. It applies exclusively to <code>sekigae.app</code>.</p>

                    <p>The software itself is provided under the GNU Affero General Public License v3.0, as indicated in the <a href="https://github.com/kakkokari-gtyih/sekigae-app">source code</a>. If the software is used in services other than the Service (<code>sekigae.app</code>), please contact the provider of that service for their terms of use and conditions.</p>

                    <h2>Article 1 (Applicability)</h2>

                    <ol>
                        <li>This Agreement applies to all relationships related to the use of the Service between the User and the Operator.</li>
                        <li>The Operator may establish rules, etc. (hereinafter referred to as "Individual Provisions") in addition to this Agreement regarding the use of the Service. Regardless of their name, these Individual Provisions are considered part of this Agreement.</li>
                        <li>In the event of a conflict between the provisions of this Agreement and those of the Individual Provisions in the preceding paragraph, unless otherwise specified in the Individual Provisions, the provisions of the Individual Provisions shall take precedence.</li>
                    </ol>

                    <h2>Article 2 (Terms of Use and Procedures)</h2>

                    <p>No user registration is required to use the Service.</p>

                    <h2>Article 3 (Usage Fees and Payment Methods)</h2>

                    <p>The use of the Service is free of charge.</p>

                    <h2>Article 4 (Prohibited Actions)</h2>

                    <p>Users are prohibited from engaging in the following actions when using the Service:</p>

                    <ul>
                        <li>Actions that disrupt or interfere with the functioning of the Operator, the Service, or third-party servers or networks.</li>
                        <li>Actions that may obstruct the operation of the Service.</li>
                        <li>Unauthorized access or attempts to do so.</li>
                        <li>Actions that provide direct or indirect benefits to antisocial forces in connection with the Service.</li>
                        <li>Actions that infringe upon the intellectual property rights, portrait rights, privacy, honor, or other rights or interests of the Operator, other users of the Service, or third parties.</li>
                        <li>Actions aimed at or for purposes that the Operator deems as follows:
                            <ul>
                                <li>Actions that lead directly to business, advertising, promotion, solicitation, or other profit-making purposes through the use of the Service (except as approved by the Operator).</li>
                                <li>Actions aimed at or for sexual or obscene activities.</li>
                                <li>Actions aimed at or for encounters or relationships with strangers of the opposite sex.</li>
                                <li>Actions aimed at harassing, defaming, or slandering other users.</li>
                                <li>Actions aimed at causing harm, damage, or discomfort to the Operator, other users of the Service, or third parties.</li>
                                <li>Actions that use the Service for purposes other than those envisioned by the Operator.</li>
                                <li>Religious activities or solicitation for religious organizations.</li>
                            </ul>
                        </li>
                        <li>Other actions deemed inappropriate by the Operator.</li>
                    </ul>

                    <h2>Article 5 (Suspension of Service Provision, etc.)</h2>

                    <ol>
                        <li>If the Operator determines that any of the following reasons exist, the Operator may suspend or interrupt all or part of the provision of the Service to the User without prior notice:
                            <ul>
                                <li>When maintenance, inspection, or updating of the computer system for the Service is carried out.</li>
                                <li>When the provision of the Service becomes difficult due to force majeure events such as earthquakes, lightning, fire, power outages, or natural disasters.</li>
                                <li>When the computer or communication network is stopped due to an accident.</li>
                                <li>When the Operator deems the provision of the Service to be difficult for any other reason.</li>
                            </ul>
                        </li>
                        <li>The Operator may terminate the provision of the Service at its discretion. In such a case, the Operator shall notify the User in advance.</li>
                        <li>The Operator shall not be responsible for any disadvantages or damages incurred by the User or third parties due to the suspension or interruption of the provision of the Service.</li>
                    </ol>

                    <h2>Article 6 (Usage Restrictions)</h2>

                    <ol>
                        <li>If the User falls under any of the following conditions, the Operator may, without prior notice, restrict the User from using all or part of the Service:
                            <ul>
                                <li>If the User violates any provision of this Agreement.</li>
                                <li>If false information is found in the registered information.</li>
                                <li>If there is a default in obligations.</li>
                                <li>If there is no response to communication from the Operator for a certain period of time.</li>
                                <li>If there has been no use of the Service for a certain period of time.</li>
                                <li>If the Operator deems the use of the Service to be inappropriate for any other reason.</li>
                            </ul>
                        </li>
                        <li>If any of the conditions in the preceding paragraph apply, the User shall lose the benefit of the term for all obligations owed to the Operator and shall immediately and in a lump sum pay all obligations then due.</li>
                        <li>The Operator shall not be liable for any damages incurred by the User as a result of the actions taken by the Operator based on this Article.</li>
                    </ol>

                    <h2>Article 7 (Disclaimer and Limitation of Liability)</h2>

                    <ol>
                        <li>The Operator does not expressly or implicitly warrant that the Service is free from defects (including safety, reliability, accuracy, completeness, effectiveness, suitability for a particular purpose, security, etc.) in fact or in law.</li>
                        <li>Except in cases of willful misconduct or gross negligence by the Operator, the Operator shall not be liable for any damages incurred by the User as a result of the Service. However, this disclaimer shall not apply if the contract between the Operator and the User regarding the Service (including this Agreement) is deemed a consumer contract under the Consumer Contract Act.</li>
                        <li>Even in the case stipulated in the proviso of the preceding paragraph, the Operator shall not be liable for any damages caused to the User by the Operator's negligence (excluding gross negligence). Furthermore, the compensation for damages caused by the Operator's negligence (excluding gross negligence) shall be limited to the amount of the usage fees received from the User for the month in which the damage occurred.</li>
                        <li>The Operator shall not be responsible for any transactions, contacts, disputes, etc. that arise between the User and other users or third parties in connection with the Service.</li>
                    </ol>

                    <h2>Article 8 (Changes to Service Content, etc.)</h2>

                    <p>The Operator may change, add, or discontinue the content and specifications of the Service, and the User agrees to such changes.</p>

                    <h2>Article 9 (Personal Information)</h2>

                    <p>The Service does not collect or store personally identifiable information.</p>

                    <h2>Article 10 (Changes to the Terms of Use)</h2>

                    <ol>
                        <li>The Operator may change this Agreement without obtaining individual consent from the User in the following cases:
                            <ul>
                                <li>When the change to this Agreement is in the general interest of the User.</li>
                                <li>When the change to this Agreement does not contradict the purpose of the Service use agreement and is reasonable in view of the necessity of the change and the substance of the change.</li>
                            </ul>
                        </li>
                        <li>In the event of a change to this Agreement as described in the preceding paragraph, the Operator shall notify the User in advance of the intent to change this Agreement, the content of the changed Agreement, and the effective date of the change.</li>
                        <li>Anyone who uses the Service after the changed terms and conditions come into effect shall be deemed to have agreed to the changed terms and conditions.</li>
                    </ol>

                    <h2>Article 11 (Notifications or Communications)</h2>

                    <p>Notifications or communications between the User and the Operator shall be made by the method specified by the Operator. Unless the Operator receives notification of a change in contact information in accordance with a separate method specified by the Operator, the currently registered contact information shall be deemed valid and notifications or communications sent to that contact information shall be considered to have reached the User at the time of transmission.</p>

                    <h2>Article 12 (Prohibition of Assignment of Rights and Obligations)</h2>

                    <p>Without the prior written consent of the Operator, the User may not assign to or pledge to a third party any rights or obligations under the usage agreement or this Agreement.</p>

                    <h2>Article 13 (Status of Translated Agreements)</h2>

                    <p>This Agreement and Individual Provisions may be translated in whole or in part for the convenience of the User, but in the event of any inconsistency between languages, the Japanese version, which is the original version, shall prevail.</p>

                    <h2>Article 14 (Severability)</h2>

                    <p>If any provision or part of any provision of this Agreement is determined to be invalid or unenforceable under the Consumer Contract Act or other laws and regulations, the remaining provisions of this Agreement and the remaining part of the provision determined to be invalid or unenforceable shall continue to be fully effective. The Operator and the User shall endeavor to modify the invalid or unenforceable provision or part to make it legal and enforceable, while ensuring that it achieves the intended purpose and has a legal and economic effect equivalent to that of the invalid or unenforceable provision or part.</p>

                    <h2>Article 15 (Governing Law and Jurisdiction)</h2>

                    <ol>
                        <li>Japanese law shall govern the interpretation of this Agreement.</li>
                        <li>In the event of a dispute arising in connection with the Service, the court with jurisdiction over the address of the Operator shall have exclusive jurisdiction.</li>
                    </ol>

                    <p>Updated on August 18, 2023</p>
                </div>
            </UCard>
        </UContainer>
    </div>
</template>

<script setup lang="ts">
import "github-markdown-css/github-markdown.css";

const { locale } = useI18n();
</script>

<style scoped>.markdown-body {
    @apply font-sans;
}

.markdown-body ul {
    list-style-type: revert;
}

.markdown-body ol {
    list-style-type: revert;
}</style>