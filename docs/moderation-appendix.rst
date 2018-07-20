.. index:: ! moderation-appendix
.. _moderation-appendix:


###################
Moderation Appendix
###################

Functions
~~~~~~~~~

================    ====================================================
ID                  Mf1
================    ====================================================
Name                ``extendModerationWindow``

Description         | Internal function for extending the moderation window after the completion of
                    | another phase to the moderation process. This occurs after challenge deposit has
                    | been met or after affirm deposit has been met.


Contract            ``Moderation.sol``

Emits               *None*

Parameters          | ``bytes32`` **_hash** -- response targeted for or by moderation phase
                    | ``uint256`` **_type** -- challenge type ID

Requirements        *None*

Returns             *None*
================    ====================================================



================    ====================================================
ID                  Mf2
================    ====================================================
Name                ``challenge``

Description         | Initializes a challenge either for or against a response. If the challenge is for a
                    | response, the sender is indicating that the response satisfies the query and the bounty
                    | staked to the query should be deposited to the creator of the response. If the
                    | challenge is against the response, the sender is indicating that this response is
                    | malicious or invalid and should therefore be blocked from retrieving disbursements.
                    | The challenge action is confirmed once the collective deposits for a challenge reach
                    | either 1/100 of the total amount staked or disbursed. The confirmation of a challenge
                    | invalidates the opposing party until it is confirmed for affirmation.


Contract            ``Moderation.sol``

Emits               *None*

Parameters          | ``bytes32`` **_qHash** -- query targeted for challenge, or query of response targeted
                    | ``bytes32`` **_rHash** -- response targeted for or by challenge
                    | ``uint256`` **_deposit** -- amount being deposited to meet challenge deposit need
                    | ``uint256`` **_type** -- challenge type ID

Requirements        - Response must have be a response to the query in question
                    - Response must not have already been challenged by this type
                    - Sender balance must not exceed amount depositing for challenge
                    - Challenge deposit addition must not exceed total necessary to confirm challenge
                    - Response must be initialized, from **Ms1**
                    - Type must be a valid challenge type, from **Ms2**

Returns             *None*
================    ====================================================



================    ====================================================
ID                  Mf3
================    ====================================================
Name                ``challengeDepositNeeded``

Description         | Returns the necessary amount of additional deposits needed to confirm a challenge.


Contract            ``Moderation.sol``

Emits               *None*

Parameters          | ``bytes32`` **_qHash** -- query hash for type 1 staking
                    | ``bytes32`` **_rHash** -- response hash for non-type 1 staking
                    | ``uint256`` **_type** -- challenge type ID


Requirements        *None*

Returns             ``uint256`` necessary deposit amount
================    ====================================================



================    ====================================================
ID                  Mf4
================    ====================================================
Name                ``affirm``

Description         | Initializes an affirm after a response has been challenged. If the challenge was
                    | against the response, the affirming sender is indicating that the response remains
                    | valid and should therefore be able to retrieve disbursements. If the challenge was
                    | for the response, the sender is indicating that the response does not satisfy the
                    | query and should therefore not receive the query's staked bounty amount.


Contract            ``Moderation.sol``

Emits               *None*

Parameters          | ``bytes32`` **_rHash** -- challenged response
                    | ``uint256`` **_deposit** -- amount being deposited to meet affirm deposit needs
                    | ``uint256`` **_type** -- challenge type ID


Requirements        - Response must have been confirmed for challenge
                    - Sender balance must not exceed amount depositing for affirming
                    - Affirm deposit addition must not exceed total necessary to confirm affirm
                    - Response must be initialized, from **Ms1**
                    - Moderation window must not have closed for response, from **Ms4**

Returns             *None*
================    ====================================================



================    ====================================================
ID                  Mf5
================    ====================================================
Name                ``affirmDepositNeeded``

Description         | Returns the necessary amount of additional deposits needed to confirm an affirm.


Contract            ``Moderation.sol``

Emits               *None*

Parameters          | ``bytes32`` **_rHash** -- challenged response hash
                    | ``uint256`` **_type** -- challenge type ID


Requirements        *None*

Returns             ``uint256`` necessary deposit amount
================    ====================================================



================    ====================================================
ID                  Mf6
================    ====================================================
Name                ``moderateObject``

Description         | Moderates the claim of a challenge on an object as either valid or invalid as
                    | determined by the community moderator that is calling this function. This increments
                    | the moderators vote with the sign with which they are voting.


Contract            ``Moderation.sol``

Emits               *None*

Parameters          | ``bytes32`` **_qHash** -- query to which response was made
                    | ``bytes32`` **_rHash** -- challenged or challenging response
                    | ``uint256`` **_type** -- challenge type ID
                    | ``bool`` **_isValid** -- yes or no vote on the challenges validity


Requirements        - Response must be initialized, from **Ms1**
                    - Moderation window must not have expired, from **Ms4**
                    - Supplied query must be the query to which the response was made
                    - Sender must be a moderator of the query's community
                    - Sender must not have previously moderated this response with this type

Returns             *None*
================    ====================================================



================    ====================================================
ID                  Mf7
================    ====================================================
Name                ``retrieveModerationDeposit``

Description         | Retrieves the deposit made for challenge or affirming. This can only be done by the
                    | party validated by moderation, or through challenge expiration. If the object
                    | challenge is moderated as valid or if the moderation window expires without
                    | affirming, the challenge deposit may be retrieved. If the object challenge is
                    | moderated as invalid the affirm deposit may be retrieved.


Contract            ``Moderation.sol``

Emits               *None*

Parameters          | ``bytes32`` **_rHash** -- challenged or challenging response
                    | ``uint256`` **_type** -- challenge type ID


Requirements        - Response must be initialized, from **Ms1**
                    - Moderation window must have expired, from **Ms5**
                    - Moderation deposit cannot already be collected on object in question

Returns             *None*
================    ====================================================



================    ====================================================
ID                  Mf8
================    ====================================================
Name                ``collectModerationPayment``

Description         | Deposit a moderator's share of the invalidated party's deposit(s) to the moderator.
                    | This serves as the incentive for moderation. The moderator receives in equal portion
                    | of the invalidated deposit, shared among all moderators of the object in question.


Contract            ``Moderation.sol``

Emits               *None*

Parameters          | ``bytes32`` **_rHash** -- challenged or challenging response
                    | ``uint256`` **_type** -- challenge type ID


Requirements        - Response must be initialized, from **Ms1**
                    - Moderation window must have expired, from **Ms5**
                    -
                    - Sender must have moderated the object in question.

Returns             *None*
================    ====================================================



================    ====================================================
ID                  Mf9
================    ====================================================
Name                ``activateModerator``

Description         | Activates the sender as a moderator of a specific community, with a withdrawal of a
                    | deposit to be held in escrow until the moderator deactivates their status for this
                    | community. A lockout period is establish from which the moderator cannot
                    | deactivate within. This is established to avoid moderator status churning.


Contract            ``Moderation.sol``

Emits               *None*

Parameters          | ``string`` **_community** -- community in question


Requirements        - Sender must not currently be a moderator of the specified community
                    - Moderation lockout must have expired from previous activation
                    - Sender must have sufficient balance

Returns             *None*
================    ====================================================



================    ====================================================
ID                  MfA
================    ====================================================
Name                ``deactivateModerator``

Description         | Deactivates the sender as a moderator of a specific community and release
                    | deposit back to sender.


Contract            ``Moderation.sol``

Emits               *None*

Parameters          | ``string`` **_community** -- community in question

Requirements        - Sender must currently be a moderator of the specified community

Returns             *None*
================    ====================================================




Structures
~~~~~~~~~~


================    ====================================================
ID                  Ms1
================    ====================================================
Name                ``initialized``

Contract            ``Moderation.sol``

Description         | Modifier function for requiring that the content (query or response) has been
                    | initialized by check that the owner value is non-zero.

Type                ``modifier``
================    ====================================================


================    ====================================================
ID                  Ms2
================    ====================================================
Name                ``validChallengeType``

Contract            ``Moderation.sol``

Description         | Modifier function for requiring that the challenge being initialized is a pre-approved
                    | form of challenge. Currently this includes challenging the validity of an outstanding
                    | bounty (type 1) or challenging the validity of a recently disbursed bounty , being
                    | type 2 or 3.

Type                ``modifier``
================    ====================================================



================    ====================================================
ID                  Ms3
================    ====================================================
Name                ``isModerator``

Contract            ``Moderation.sol``

Description         | Modifier function for requiring that the sender of the function is a moderator of the
                    | community of the content in question. This is used when moderating an object.

Type                ``function``
================    ====================================================



================    ====================================================
ID                  Ms4
================    ====================================================
Name                ``inModerationWindow``

Contract            ``Moderation.sol``

Description         | Modifier function for requiring that the object in questions is currently within the
                    | given moderation window. This is used to is check that the moderation window hasn't
                    | expired prior to calling the next step in moderation for affirming and moderating
                    | objects.

Type                ``modifier``
================    ====================================================



================    ====================================================
ID                  Ms5
================    ====================================================
Name                ``outModerationWindow``

Contract            ``Moderation.sol``

Description         | Modifier function for requiring that the object in question is outside the given
                    | moderation window. This is used to is check that the moderation window has concluded
                    | prior to retrieving deposits or collecting payment.


Type                ``modifier``
================    ====================================================
