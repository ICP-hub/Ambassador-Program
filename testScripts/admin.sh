backend="p5sam-ueaaa-aaaaa-qabda-cai"
spaceID="swldj-h3c5k-be3yy-n4dbk-nxiyp-6kt4u-rgrvw-yt62l-buym5-pqlpl-vqe_1"

# dfx canister call $backend

# echo "("$backend",record {hotelTitle= 'Indane';hotelDes='Comfyrooms';hotelImage='djnjdseed';hotelPrice='120000';hotelLocation='London'})"

echo "-------------------------------Creating new admin-------------------------------------------"
dfx canister call $backend register_admin

echo "-------------------------------Creating new space-------------------------------------------"
dfx canister call $backend create_space '(record {chain="sample chain"; name="space"; slug="s1"; description="sample space"})'

echo "-------------------------------Get all spaces----------------------------------------------"
dfx canister call $backend get_all_spaces 

echo "-------------------------------Create mission----------------------------------------------"
dfx canister call $backend create_draft_mission '("'${spaceID}'")'

echo "-------------------------------get all space specific missions-----------------------------"
dfx canister call $backend get_all_space_missions '("'${spaceID}'")'
