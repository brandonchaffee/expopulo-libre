.. index:: ! eternal-storage-appendix
.. _ eternal-storage-appendix:


########################
Eternal Storage Appendix
########################

Functions
~~~~~~~~~

================    ====================================================
ID                  ESf1
================    ====================================================
Name                ``getSUint``

Description         | Universal getter for retrieving value from SUint mapping.


Contract            ``EternalStorage.sol``

Emits               *None*

Parameters          | ``bytes32`` **_hash** -- keccak256 hash of the identity, tightly packed


Requirements        *None*

Returns             ``uint256`` retrieved uint value
================    ====================================================



================    ====================================================
ID                  ESf2
================    ====================================================
Name                ``getSString``

Description         | Universal getter for retrieving value from SString mapping.


Contract            ``EternalStorage.sol``

Emits               *None*

Parameters          | ``bytes32`` **_hash** -- keccak256 hash of the identity, tightly packed


Requirements        *None*

Returns             ``string`` retrieved string value
================    ====================================================



================    ====================================================
ID                  ESf3
================    ====================================================
Name                ``getSAddress``

Description         | Universal getter for retrieving value from SAddress mapping.


Contract            ``EternalStorage.sol``

Emits               *None*

Parameters          | ``bytes32`` **_hash** -- keccak256 hash of the identity, tightly packed


Requirements        *None*

Returns             ``address`` retrieved address value
================    ====================================================



================    ====================================================
ID                  ESf4
================    ====================================================
Name                ``getSBytes``

Description         | Universal getter for retrieving value from SBytes mapping.


Contract            ``EternalStorage.sol``

Emits               *None*

Parameters          | ``bytes32`` **_hash** -- keccak256 hash of the identity, tightly packed


Requirements        *None*

Returns             ``bytes`` retrieved bytes value
================    ====================================================



================    ====================================================
ID                  ESf5
================    ====================================================
Name                ``getSBool``

Description         | Universal getter for retrieving value from SBool mapping.


Contract            ``EternalStorage.sol``

Emits               *None*

Parameters          | ``bytes32`` **_hash** -- keccak256 hash of the identity, tightly packed


Requirements        *None*

Returns             ``bool`` retrieved bool value
================    ====================================================



================    ====================================================
ID                  ESf6
================    ====================================================
Name                ``getSInt``

Description         | Universal getter for retrieving value from SInt mapping.


Contract            ``EternalStorage.sol``

Emits               *None*

Parameters          | ``bytes32`` **_hash** -- keccak256 hash of the identity, tightly packed


Requirements        *None*

Returns             ``int256`` retrieved int value
================    ====================================================


Structures
~~~~~~~~~~

================    ====================================================
ID                  ESs1
================    ====================================================
Name                ``SUint``

Contract            ``EternalStorage.sol``

Description         | Universal storage for all uint values, mapped to the keccak256 hash of their identity.

Type                mapping of ``bytes32`` to ``uint256``
================    ====================================================



================    ====================================================
ID                  ESs2
================    ====================================================
Name                ``SString``

Contract            ``EternalStorage.sol``

Description         | Universal storage for all string values, mapped to the keccak256 hash of their identity.

Type                mapping of ``bytes32`` to ``string``
================    ====================================================



================    ====================================================
ID                  ESs3
================    ====================================================
Name                ``SAddress``

Contract            ``EternalStorage.sol``

Description         | Universal storage for all address values, mapped to the keccak256 hash of their
                    | identity.

Type                mapping of ``bytes32`` to ``address``
================    ====================================================



================    ====================================================
ID                  ESs4
================    ====================================================
Name                ``SBool``

Contract            ``EternalStorage.sol``

Description         | Universal storage for all bool values, mapped to the keccak256 hash of their identity.

Type                mapping of ``bytes32`` to ``bool``
================    ====================================================



================    ====================================================
ID                  ESs5
================    ====================================================
Name                ``SInt``

Contract            ``EternalStorage.sol``

Description         | Universal storage for all int256 values, mapped to the keccak256 hash of their identity.

Type                mapping of ``bytes32`` to ``int256``
================    ====================================================


================    ====================================================
ID                  ESs6
================    ====================================================
Name                ``SBytes``

Contract            ``EternalStorage.sol``

Description         | Universal storage for all bytes values, mapped to the keccak256 hash of their identity.

Type                mapping of ``bytes32`` to ``bytes``
================    ====================================================
