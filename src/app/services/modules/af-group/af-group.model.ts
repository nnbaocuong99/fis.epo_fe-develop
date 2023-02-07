export class AfGroupDto {
    groupId: string;
    groupCode: string;
    groupName: string;
    groupDto: any;

    constructor(obj?: any) {
        if (obj) {
            Object.assign(this, obj);
        }

        if (this.groupId) {
            this.groupDto = {};
            this.groupDto.orgCode = obj.groupCode;
            this.groupDto.orgName = obj.groupName;
            this.groupDto.Id = obj.groupId;
        }
    }
}